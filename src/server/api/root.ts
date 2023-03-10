import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { chatRouter } from "./routers/chat";
import { tweetRouter } from "./routers/tweet";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  chat: chatRouter,
  tweet: tweetRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
