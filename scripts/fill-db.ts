import { PokemonClient } from "pokenode-ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const doBackFill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);
  const formattedPokemon = allPokemon.results.map((p, index) => ({
    id: String(index + 1),
    name: p.name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));
  await prisma.pokemon.createMany({ data: formattedPokemon });
};

doBackFill().catch((err) => console.log(err));
