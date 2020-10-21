export function listCards(stateCards, listId) {
  return stateCards.filter(
    (card) => !card.archived && card.listId === listId
  );
}

export function getCardById(state, id) {
  return state.cards.find((card) => card._id === id);
}
