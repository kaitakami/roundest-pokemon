import { prisma } from '@/server/db'
import type { GetStaticProps } from 'next'
import Image from 'next/image'
import type { AsyncReturnType } from '@/utils/ts-bs'

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

const Results: React.FC<{ pokemon: PokemonQueryResult }> = ({ pokemon }) => {
  return (
    <div className='flex flex-col items-center'>
      <h2 className='py-5 text-2xl font-bold'>Results</h2>
      <div className='flex flex-col max-w-2xl w-full border'>
        {pokemon.map((currentPokemon) => (
          <PokemonListing key={currentPokemon.id} pokemon={currentPokemon} />
        ))}
      </div>
    </div>
  )
}

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votedFor, votedAgainst } = pokemon._count
  if (votedFor + votedAgainst === 0) return 0
  return (votedFor / (votedFor + votedAgainst) * 100).toFixed(1)
}

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({ pokemon }) => {
  return (
    <div className='flex border-b p-2 px-5 justify-between w-full max-w-2xl'>
      <div className='flex items-center'>
        <Image src={pokemon.spriteUrl} alt={`${pokemon.name} Image`} width={64} height={64} priority />
        <p className='capitalize'>{pokemon.name}</p>
      </div>
      <div className='my-auto'>
        {generateCountPercent(pokemon)}%
      </div>
    </div>
  )
}

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votedFor: { _count: "desc" }
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votedFor: true,
          votedAgainst: true
        }
      }
    }
  })
}

export default Results

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder()
  return {
    props: { pokemon: pokemonOrdered },
    revalidate: 60
  }
}

