import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
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
    const { text, imageUrls } = input;
    const usereId = session.user.id;
    return prisma.tweet.create({
      data: {
        text,
        author: {
          connect: {
            id: usereId,
          },
        },
        // imgsTw: {
        //   create: imageUrls.map((url) => ({ url })),
        // },
      },
    });
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
          // imgsTw: {
          //   select: {
          //     url: true,
          //   },
          // },
        },
      });
      return {
        tweets,
      };
    }),
  createPresignedUrl: protectedProcedure
    // .input()
    .mutation(async ({ ctx }) => {
      const { prisma } = ctx;
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }
      const userId = ctx.session.user.id;

      const image = await prisma.image.create({
        data: {
          userId,
        },
      });

      return new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: `${userId}/${image.id}`,
            },
            Conditions: [
              ["starts-with", "$Content-Type", "image/"],
              // ["content-length-range", 1, 100000000],
            ],
            Expires: 60,
            Bucket: "twcloneimages",
          },
          (err, signed) => {
            if (err) return reject(err);
            resolve(signed);
          }
        );
      });
    }),
  getImagesForUser: protectedProcedure
    // .input()
    .query(async ({ ctx }) => {
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
      console.log("object");
      console.log(extendedImages);
      return extendedImages;
    }),
});
