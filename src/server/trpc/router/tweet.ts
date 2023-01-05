
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { tweetSchema } from "../../../components/main/MainPageTw";
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
        imgsTw: {
          create: imageUrls.map((url) => ({ url})),
        },
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
      const { cursor, limit} = input;
      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id:true,
          text: true,
            author: {
              select: {
                name: true,
                image: true,
                id: true,
              },
            },
            imgsTw: {
              select: {
                url: true,
              },
            },
        },
      });
      return {
        tweets,
      };
    }),
});