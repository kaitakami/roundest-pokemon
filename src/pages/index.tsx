import { useState } from "react";
import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/utils/api";
import { getOptionsForVote } from '../utils/getRandomPokemon';

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsForVote())
  const [first, second] = ids

  const firstPokemon = api.pokemon["get-pokemon-by-id"].useQuery({ id: first })
  const secondPokemon = api.pokemon["get-pokemon-by-id"].useQuery({ id: second })

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null


  const voteForRoundest = (selected: number) => {
    // todo: fire mutation to persist changes

    setIds(getOptionsForVote())
  }


  return (
    <>
      <Head>
        <title>Roundest Pokemon</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">Which pokemon is Rounder?</div>
        <div className="p-2" />
        <div className="rounded p-8 flex justify-between max-w-2xl items-center">
          {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (<>
            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
            <div className="p-8">VS</div>
            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

interface PokemonFromServer {
  name: string,
  sprites: {
    front_default: string | null
  }
}

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  if (!props.pokemon.sprites.front_default) return <div>Loading...</div>
  return (<div className="flex flex-col justify-center">
    <div className="relative w-64 h-64">
      <Image src={props.pokemon.sprites.front_default} alt={props.pokemon.name} fill sizes="(max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    33vw" priority />
    </div>
    <div className="capitalize text-center text-xl mt-[-1rem]">{props.pokemon.name}</div>
    <button className="whitespace-nowrap rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 m-auto" type="button" onClick={() => props.vote()}>Rounder</button>
  </div>)
}
