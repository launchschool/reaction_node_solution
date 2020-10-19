const express = require ('express');
const router = express.Router();
const boardsController = require("../controllers/boardsController");
const {check} = require("express-validator");


router.get('/boards',boardsController.getBoards );

router.post('/boards', check("title").not().isEmpty(), boardsController.createBoard );

router.get('/boards/:id', boardsController.getBoard);

module.exports = router;