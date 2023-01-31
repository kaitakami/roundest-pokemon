import { z } from "zod";
import { PokemonClient } from "pokenode-ts";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pokemonRouter = createTRPCRouter({
  "get-pokemon-by-id": publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(input.id);
      return { name: pokemon.name, sprites: pokemon.sprites };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
