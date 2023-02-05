const MAX_DEX_ID = 493;

const getRandomPokemon: (notThisOne?: string) => string = (
  notThisOne?: string
) => {
  const pokedexNumber = String(Math.floor(Math.random() * MAX_DEX_ID + 1));

  if (pokedexNumber !== notThisOne) return pokedexNumber;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote: () => [string, string] = () => {
  const firstId = String(getRandomPokemon());
  const secondId = String(getRandomPokemon(firstId));

  return [firstId, secondId];
};
