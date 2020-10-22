export function cardComments(stateComments, cardId, sortFunction) {
  const comments = stateComments.filter((comment) => comment.cardId === cardId);

  if (typeof sortFunction === "function") {
    return comments.sort(sortFunction);
  } else {
    return comments;
  }
}

export function cardCommentsAndActions(
  stateComments,
  stateActions,
  cardId,
  sortFunction
) {
  const comments = cardComments(stateComments, cardId);
  const actions = stateActions
    .filter((action) => {
      return action.cardId === cardId;
    })
    .map((action) => ({ ...action, isAction: true }));

  if (typeof sortFunction === "function") {
    return comments.concat(actions).sort(sortFunction);
  } else {
    return comments.concat(actions);
  }
}
