import { z } from "zod";

import {
  protectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `${input.text}`,
      };
    }),
  protected: protectedProcedure.query(async ({ ctx }) => {
    return {
      email: ctx.user.email,
    };
  }),
});
