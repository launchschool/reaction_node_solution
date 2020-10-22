export function listCards(stateCards, listId, sortFunction) {
  const cards = stateCards.filter(
    (card) => !card.archived && card.listId === listId
  );
  if (typeof sortFunction === "function") {
    return cards.sort(sortFunction);
  } else {
    return cards;
  }
}

export function getCardById(state, id) {
  return state.cards.find((card) => card._id === id);
}
