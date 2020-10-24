const List = require("../models/list");

const findList = (req, res, next) => {
  const listId = req.body.listId || req.params.id;
  List.findById(listId)
    .populate("board")
    .then(list => {
      if (!list) {
        throw new Error("List doesn't exist");
      }
      req.list = list;
      next();
    });
};

const findListForCard = (req, res, next) => {
  if (req.body.card.listId) {
    const listId = req.body.card.listId;
    List.findById(listId)
    .then(list => {
      if (!list) {
        throw new Error("List doesn't exist");
      }
      req.list = list;
      next();
    });
  } else {
    next();
  }
}

const updateList = (req, res, next) => {
  const list = req.list;
  const { title, position } = req.body;
  const listId = list._id;

  List.findByIdAndUpdate(
    listId,
    {
      title: title || list.title,
      position: position || list.position
    },
    { new: true }
  )
    .then(updatedList => {
      req.list = updatedList;
      next();
    });
};

const createList = (req, res, next) => {
  const { title, boardId, position } = req.body;
  List.create({
    title: title || "New List",
    position: position || 65535,
    cards: [],
    boardId: boardId
  }).then(list => {
    req.list = list;
    next();
  });
};

const sendList = (req, res) => {
  let list = req.list;
  List.find({ _id: list._id }, 'title position boardId createdAt updatedAt').then(list => {
      res.json({ list });
  })
};

const addCardToList = (req, res, next) => {
  const card = req.card;
  let listId;
  if (req.listId) {
    listId = req.listId;
    List.findByIdAndUpdate(listId, {
      $addToSet: { cards: card._id }
  }).then(() => next());
  }
  listId = req.list._id;
  List.findByIdAndUpdate(listId, {
    $addToSet: { cards: card._id }
  }).then(() => next());
};

const removeCardFromList = (req, res, next) => {
  const card = req.card;
  List.updateOne(
    { cards: { $in: [card._id] } },
    {
      $pull: { cards: card._id }
    }
  ).then(() => next());
};

const removeUpdatedCardFromList = (req, res, next) => {
  if (!req.listId) {
    next();
  }
  const card = req.card;
  List.updateOne(
    { cards: { $in: [card._id] } },
    {
      $pull: { cards: card._id }
    }
  ).then(() => next());

}

exports.findList = findList;
exports.updateList = updateList;
exports.createList = createList;
exports.sendList = sendList;
exports.addCardToList = addCardToList;
exports.removeCardFromList = removeCardFromList;
exports.findListForCard = findListForCard;
exports.removeUpdatedCardFromList = removeUpdatedCardFromList;

