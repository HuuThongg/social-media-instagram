import { router, protectedProcedure, publicProcedure } from "../trpc";
import {   z } from "zod";
import { tweetSchema } from "../../../components/main/MainPageTw";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: "v4",
});

export const tweetRouter = router({
  create: protectedProcedure.input(tweetSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { text } = input;
    const userId = session.user.id;
    return prisma.tweet
      .create({
        data: {
          text,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      })
      .then((tweet) => ({ tweetId: tweet.id }));
  }),
  timeline: publicProcedure
    .input(
      z.object({
        where: z
          .object({
            author: z
              .object({
                name: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { cursor, limit, where } = input;
      const userId = ctx.session?.user?.id;
      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        where,
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          like: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          id: true,
          text: true,
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
          _count: {
            select: {
              like: true,
              comment: true,
            },
          },
          comment :{
            select :{
              text:true,
              id: true,
              user:{
                select:{
                  image:true,
                  name:true,
                }
              }
            }
          },
          createdAt: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (tweets.length > limit) {
        const nextItem = tweets.pop() as typeof tweets[number];

        nextCursor = nextItem.id;
      }

      return {
        tweets,
        nextCursor,
      };
    }),
  createPresignedUrl: protectedProcedure
    .input(z.object({ tweetId: z.string(), n: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }

      const { n, tweetId } = input;
      const images = await Array.from({ length: n }).map(async (_) => {
        try {
          return await prisma.images.create({
            data: {
              tweetId,
            },
          });
        } catch (err) {
          console.error(err);
          throw new Error(" cant create images from tweet");
        }
      });

      const signedUrls: never[] = [];
      await Promise.all(
        images.map(async (image) => {
          try {
            const signed = await s3.createPresignedPost({
              Fields: {
                key: `${tweetId}/${(await image).id}`,
              },
              Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                // ["content-length-range", 1, 100000000],
              ],
              Expires: 3600,
              Bucket: process.env.BUCKET_NAME,
              // Bucket: "twcloneimages",
            });
            signedUrls.push(signed);
          } catch (err) {
            // Handle the error here
            throw new Error("You must be logged in");
          }
        })
      );
      return signedUrls;

      // return new Promise((resolve, reject) => {
      //   s3.createPresignedPost(
      //     {
      //       Fields: {
      //         key: `${userId}/${image.id}`,
      //       },
      //       Conditions: [
      //         ["starts-with", "$Content-Type", "image/"],
      //         // ["content-length-range", 1, 100000000],
      //       ],
      //       Expires: 600,
      //       Bucket: process.env.BUCKET_NAME,
      //       // Bucket: "twcloneimages",
      //     },
      //     (err, signed) => {
      //       if (err) return reject(err);
      //       resolve(signed);
      //     }
      //   );
      // });
    }),
  getImagesForUser: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { tweetId } = input;

      const images = await prisma.images.findMany({
        where: {
          tweetId: tweetId,
        },
      });

      const extendedImages = await Promise.all(
        images.map(async (image) => {
          return {
            ...image,
            url: await s3.getSignedUrlPromise("getObject", {
              Bucket: process.env.BUCKET_NAME,
              Key: `${tweetId}/${image.id}`,
            }),
          };
        })
      );
      return extendedImages;
    }),
  deleteImage: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { tweetId } = input;
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }
      const userId = ctx.session.user.id;

      const images = await prisma.images.findMany({
        where: {
          tweetId,
        },
      });

      const s3DeletePromises = images.map((image) => {
        const bucket = process.env.BUCKET_NAME;
        if (!bucket) {
          throw new Error("Bucket name is not defined");
        }
        return s3
          .deleteObject({
            Bucket: bucket,
            Key: `${tweetId}/${image.id}`,
          })
          .promise();
      });

      await Promise.all([
        ...s3DeletePromises,
        prisma.images.deleteMany({
          where: {
            tweetId,
          },
        }),
      ]);
    }),
  like: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;
      return prisma.like.create({
        data: {
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  unlike: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;
      return prisma.like.delete({
        where: {
          tweetId_userId: {
            tweetId: input.tweetId,
            userId,
          },
        },
      });
    }),
  createComment: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        text: z.string().optional(),
        // author: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;
      const { tweetId, text } = input;
      // if (!text) return;
      return await prisma.comment.create({
        data: {
          text,
          tweet: {
            connect: {
              id: tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
          commentId: z.string()
        }
      )
    )
    .mutation(async({ctx,input}) => {
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }
      const { prisma } = ctx;
      const {commentId} = input;

      return await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    }),
  deleteTweet: protectedProcedure
    .input(z.object({
      tweetId: z.string(),
    }))
    .mutation(async ({ctx,input}) => {
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }
      const {prisma} = ctx;
      const {tweetId} = input;
      return  await prisma.tweet.delete({
        where:{
          id: tweetId,
        }
      })
    }
    )
});
