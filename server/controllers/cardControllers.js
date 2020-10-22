const Card = require("../models/card");

const createCard = (req, res, next) => {
  let { title, position } = req.body.card;
  const list = req.list;
  const listId = list._id;
  const boardId = list.boardId;
  return Card.create({
      labels: [],
      dueDate: null,
      title: title,
      description: "",
      listId: listId,
      boardId: boardId,
      archived: false,
      position: position,
      comments: []
    }).then(card => {
      req.card = card;
      next();
  });
};

const updateCard = (req, res, next) => {
  const cardId = req.card._id;
  const { card } = req.body;
  Card.findByIdAndUpdate(
      cardId,
      {
        ...card
      },
      { new: true }
  )
    .then(card => {
        req.card = card;
        next();
  });
};

const findCard = (req, res, next) => {
  const cardId = req.params.id || req.body.cardId;
  Card.findById(cardId)
    .populate([
      {
        path: "comments"
      },
    ])
    .then(card => {
      if (!card) {
        throw new Error("Card doesn't exist");
      }
      req.card = card;
      next();
    });
};

const sendCard = (req, res) => {
  const card = req.card;
  res.json({
    card
  });
};

const addCommentToCards = (req, res, next) => {
  const cardId = req.card.id;
  const comment = req.comment;
  Card.findByIdAndUpdate(cardId, {
    $addToSet: { comments: comment._id }
  }).then(() => {
    next();
  });
};

const removeCard = (req, res, next) => {
  Card.findByIdAndRemove(req.card._id).then(() => next());
};

exports.createCard = createCard;
exports.updateCard = updateCard;
exports.findCard = findCard;
exports.sendCard = sendCard;
exports.addCommentToCards = addCommentToCards;
exports.removeCard = removeCard;

