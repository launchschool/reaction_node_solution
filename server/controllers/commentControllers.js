const Comment = require("../models/comment");

exports.createComments = (req, res, next) => {
  let { keep } = req.body.card;
  if (!keep || !keep.keepComments) {
    req.comments = [];
    next();
  } else {
      const comments = keep.cardComments.map(comment => {
        const { _id, cardId, ...commentWithoutIdAndCardId } = comment;
        commentWithoutIdAndCardId.cardId = req.card._id;
        return commentWithoutIdAndCardId;
      })

      return Comment.insertMany(comments).then(comments => {
        req.comments = comments;
        next();
      })
  }
}

exports.createComment = (req, res, next) => {
  const { text, cardId } = req.body;
  return Comment.create({
    text: text || "New Comment",
    cardId: cardId
  }).then(comment => {
    req.comment = comment;
    next();
  });
};

exports.sendComment = (req, res, next) => {
  const comment = req.comment;
  res.json({ comment });
};
