const express = require ('express');
const router = express.Router();
const boardControllers = require("../controllers/boardControllers");
const listControllers = require("../controllers/listControllers");
const cardControllers = require("../controllers/cardControllers");
const commentControllers = require("../controllers/commentControllers");
const actionControllers = require("../controllers/actionControllers");
const {check} = require("express-validator");


router.get('/boards',boardControllers.getBoards);

router.post('/boards', check("title").not().isEmpty(), boardControllers.createBoard);

router.get('/boards/:id', boardControllers.getBoard);

router.post(
  "/lists",
  boardControllers.findBoard,
  listControllers.createList,
  boardControllers.addListToBoard,
  listControllers.sendList
);

router.put(
  "/lists/:id",
  listControllers.findList,
  listControllers.updateList,
  listControllers.sendList
);


router.post(
  "/cards",
  listControllers.findList,
  cardControllers.createCard,
  listControllers.addCardToList,
  cardControllers.updateCard,
  cardControllers.sendCard
);

router.get(
  "/cards/:id",
  cardControllers.findCard,
  cardControllers.sendCard
);

router.put(
  "/cards/:id",
  cardControllers.findCard,
  actionControllers.createAction,
  cardControllers.updateCard,
  cardControllers.sendCard
);

router.post(
  "/comments",
  cardControllers.findCard,
  commentControllers.createComment,
  cardControllers.addCommentToCards,
  commentControllers.sendComment
);

router.delete(
  "/cards/:id",
  cardControllers.findCard,
  cardControllers.removeCard,
  listControllers.removeCardFromList,
  cardControllers.sendCard
);


module.exports = router;