const express = require ('express');
const router = express.Router();
const boardControllers = require("../controllers/boardControllers");
const listControllers = require("../controllers/listControllers");
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

module.exports = router;