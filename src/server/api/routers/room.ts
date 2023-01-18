import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { randomUUID } from "crypto";
import { messageSubSchema, Message, sendMessageSchema } from "../../../constants/schemas";
import { Events } from "../../../constants/events";
import * as trpc from "@trpc/server"

export const roomRouter = createTRPCRouter({
  sendMessage:publicProcedure
    .input(sendMessageSchema)
    .mutation(({ctx, input})=>{
      const message :Message = {
        id: randomUUID(),
        ...input,
        sentAt : new Date(),
        sender :{
          name : ctx.session?.user?.name || "unknown",
        }
      }
      // ctx.ee.emit(Events.SEND_MESSAGE, message);
      return message;
    }),
  // onSendMessage : publicProcedure
  //   .input(messageSubSchema)
  //   .subscription(({ctx,input}) =>{
  //     // return new trpc.Subscription<Message>((emit)=>{
  //     //   function onMessage(data: Message) {
  //     //     if(input.roomId === data.roomId){
  //     //       emit.data(data)
  //     //     }
  //     //   }
  //     //   return () =>{
  //     //     ctx.ee.off(Events.SEND_MESSAGE, onMessage)
  //     //   }
  //     // })
  //   })
})
