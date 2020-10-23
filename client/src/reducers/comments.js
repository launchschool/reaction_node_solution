export default function comments(state = [], action) {
  switch (action.type) {
    case "FETCH_CARD_SUCCESS":
      const filtered = state.filter(comment => comment.cardId !== action.payload.card._id);
      const comments = action.payload.card.comments.reduce((acc, comment) => {
        return acc.concat(comment);
      }, []);
      return filtered.concat(comments);
    case "CREATE_CARD_SUCCESS":
      const filteredComments = state.filter(comment => comment.cardId !== action.payload.card._id);
      const createComments = action.payload.card.comments.reduce((acc, comment) => {
        return acc.concat(comment);
      }, []);
      return filteredComments.concat(createComments);
    case "CREATE_COMMENT_SUCCESS":
      return state.concat(action.payload.comment);
    default:
      return state;
  }
}
