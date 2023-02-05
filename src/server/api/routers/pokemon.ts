import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pokemonRouter = createTRPCRouter({
  "get-pokemon-by-id": publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const pokemon = await ctx.prisma.pokemon.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!pokemon) throw new Error("pokemon doesn't exist");
      return pokemon;
    }),
  "cast-vote": publicProcedure
    .input(
      z.object({
        votedAgainstId: z.string(),
        votedForId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const voteInDb = await ctx.prisma.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});
