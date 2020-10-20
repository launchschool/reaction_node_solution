const List = require("../models/list");

exports.findList = (req, res, next) => {
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

exports.updateList = updateList;
exports.createList = createList;
exports.sendList = sendList;
