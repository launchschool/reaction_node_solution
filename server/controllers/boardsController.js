const Board = require("../models/board");
const HttpError = require("../models/httpError");
const { validationResult } = require("express-validator");

const getBoards = (req, res, next) => {
  Board.find({}, "title")
    .then(boards =>
      res.json({
        boards: boards.map(board => board.toObject({ getters: true }))
      })
    )
    .catch(next);
};

const createBoard = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    Board.create(req.body)
      .then(board => res.json({ board: board.toObject({ getters: true }) }))
      .catch(err =>
        next(new HttpError("Creating board failed, please try again", 500))
      );
  } else {
    return next(new HttpError("The input field is empty.", 404));
  }
};

const getBoard = (req, res) => {
  const boardId = req.params.id;
  Board.findOne({ _id: boardId })
    .populate({ path: "lists", populate: { path: "cards" } })
    .then(board => {
      if (!board) {
        throw new Error("Board doesn't exist");
      }
      res.json(board);
    })
    .catch(err => next(err));
};

exports.getBoards = getBoards;
exports.createBoard = createBoard;
exports.getBoard = getBoard;
