import { router, protectedProcedure, publicProcedure } from "../trpc";
import { promise, z } from "zod";
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
    const usereId = session.user.id;
    return prisma.tweet
      .create({
        data: {
          text,
          author: {
            connect: {
              id: usereId,
            },
          },
          // images: {
          //   create: imageUrls.map((url) => ({ url })),
          // },
        },
      })
      .then((tweet) => ({ tweetId: tweet.id }));
  }),
  timeline: publicProcedure
    .input(
      z.object({
        // where: z
        //   .object({
        //     author: z
        //       .object({
        //         name: z.string().optional(),
        //       })
        //       .optional(),
        //   })
        //   .optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { cursor, limit } = input;
      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          text: true,
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });
      return {
        tweets,
      };
    }),
  createPresignedUrl: protectedProcedure
    .input(
      z.object({ tweetId: z.string(), n: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }

      const userId = ctx.session.user.id;
      const {n,tweetId} = input;
      const images = await  Array.from({ length: n }).map(
        async (_, i) => {
          try {
            return await prisma.images.create({
              data: {
                  tweetId,
                // tweetId: {
                //   connect: {
                //     tweetId,
                //   },
                // },
                // userId: {
                //   connect: {
                //     id: userId,
                //   },
                // },
              },
            });
          } catch (err) {
            console.error(err);
            throw new Error(" cant create images from tweet")
          }
        }
      );
      // authorId: {
      //   connect: {
      //     id: userId,
      //   },
      // },
      // const images = await prisma.tweet.create({
      //   data: {
      //     images: {
      //       create: {
      //         tweetId: userId,
      //       }
      //     },
      //   },
      // });
      const signedUrls = [];
      await Promise.all(
        images.map(async (image) => {
          try {
            const signed = await s3.createPresignedPost({
              Fields: {
                key: `${userId}/${(await image).id}`,
              },
              Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                // ["content-length-range", 1, 100000000],
              ],
              Expires: 600,
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
  getImagesForUser: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    if (!ctx.session) {
      throw new Error("You must be logged in");
    }
    const userId = ctx.session.user.id;

    const images = await prisma.image.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const extendedImages = await Promise.all(
      images.map(async (image) => {
        return {
          ...image,
          url: await s3.getSignedUrlPromise("getObject", {
            Bucket: process.env.BUCKET_NAME,
            Key: `${userId}/${image.id}`,
          }),
        };
      })
    );
    return extendedImages;
  }),
  deleteImage: protectedProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx;
    if (!ctx.session) {
      throw new Error("You must be logged in");
    }
    const userId = ctx.session.user.id;

    const images = await prisma.image.findMany({
      where: {
        userId: ctx.session.user.id,
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
          Key: `${userId}/${image.id}`,
        })
        .promise();
    });

    await Promise.all([
      ...s3DeletePromises,
      prisma.image.deleteMany({
        where: {
          userId,
        },
      }),
    ]);
  }),
});
