import { useState } from "react";
import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/utils/api";
import { getOptionsForVote } from '../utils/getRandomPokemon';
import Loading from "@/components/Loading";

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsForVote())
  const [first, second] = ids

  const firstPokemon = api.pokemon["get-pokemon-by-id"].useQuery({ id: first })
  const secondPokemon = api.pokemon["get-pokemon-by-id"].useQuery({ id: second })
  const voteMutation = api.pokemon["cast-vote"].useMutation()

  if (firstPokemon.isLoading || secondPokemon.isLoading) return <Loading />

  const voteForRoundest = (selected: string) => {
    if (selected === first) {
      voteMutation.mutate({
        votedForId: selected,
        votedAgainstId: second
      })
    } else {
      voteMutation.mutate({
        votedForId: selected,
        votedAgainstId: first
      })
    }
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
        <div className="text-2xl text-center font-bold">Which pokemon is Rounder?</div>
        <div className="p-2" />
        <div className="md:flex-row flex-col rounded p-8 flex justify-between max-w-2xl items-center">
          {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (<>
            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
            <div className="p-8">VS</div>
            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </>
          )}
        </div>
      </div>
      <footer className="absolute bottom-0 w-full gap-4 left-0 text-center p-5 text-gray-300 hover:animate-pulse flex justify-center">
        <Link href="/results">Results</Link>|
        <a href="https://github.com/kaitakami" target="_blank" rel="noreferrer">My GitHub</a>
      </footer>
    </>
  );
};

export default Home;


import type { Pokemon } from "@prisma/client";

const PokemonListing: React.FC<{
  pokemon: Pokemon;
  vote: () => void;
}> = (props) => {
  if (!props.pokemon.spriteUrl) return <div>Loading...</div>
  return (<div className="flex flex-col justify-center">
    <div className="relative w-64 h-64">
      <Image src={props.pokemon.spriteUrl} alt={props.pokemon.name} fill sizes="256" priority />
    </div>
    <div className="capitalize text-center text-xl mt-[-1rem]">{props.pokemon.name}</div>
    <button className="whitespace-nowrap rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 m-auto" type="button" onClick={() => props.vote()}>Rounder</button>
  </div>)
}
