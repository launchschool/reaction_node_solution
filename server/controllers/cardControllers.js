const Card = require("../models/card");
const Action = require("../models/action");

const createCard = (req, res, next) => {
  let { title, position, copyFrom } = req.body.card;
  const list = req.list;
  const listId = list._id;
  const boardId = list.boardId;
  let copyCard = {};
  if (copyFrom) {
    Card.findById(copyFrom).then(card => {
      copyCard = card;
      Card.create({
        labels: copyCard.labels,
        dueDate: copyCard.dueDate,
        title: copyCard.title,
        description: copyCard.description,
        listId: listId,
        boardId: boardId,
        archived: false,
        position: position,
        comments: [],
        actions: copyCard.actions
      }).then(card => {
        req.card = card;
        next();
      });
    });
  } else {
    return Card.create({
      labels: [],
      dueDate: null,
      title: title,
      description: "",
      listId: listId,
      boardId: boardId,
      archived: false,
      position: position,
      comments: [],
      actions: []
    }).then(card => {
      req.card = card;
      next();
    });
  }
};

const updateCard = (req, res, next) => {
  const action = req.action;
  const cardId = req.card._id;
  let { card } = req.body;
  if (req.list) {
    card.boardId = req.list.boardId;
    req.listId = req.list._id;
  }
  if (action) {
    Card.findByIdAndUpdate(
      cardId,
      {
        ...card,
        $push: { actions: action._id }
      },
      { new: true }
    )
      .populate(["actions"])
      .then(card => {
        req.card = card;
        next();
      });
  } else {
    Card.findByIdAndUpdate(
      cardId,
      {
        ...card
      },
      { new: true }
    )
      .populate(["actions"])
      .then(card => {
        req.card = card;
        next();
      });
  }
};

const findCard = (req, res, next) => {
  const cardId = req.params.id || req.body.cardId;
  Card.findById(cardId)
    .populate([
      {
        path: "comments"
      },
      {
        path: "actions"
      }
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

const addCommentsToCard = (req, res, next) => {
  const cardId = req.card._id;
  if (req.comments) {
    Card.findByIdAndUpdate(cardId, {
      $addToSet: { comments: { $each : req.comments }  }
    }).then(() => {
      next();
    });
  } else {
    next();
  }
}

const addCommentToCard = (req, res, next) => {
  const cardId = req.card._id;
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
exports.addCommentToCard = addCommentToCard;
exports.removeCard = removeCard;
exports.addCommentsToCard = addCommentsToCard;

