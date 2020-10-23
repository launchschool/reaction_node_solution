const Action = require("../models/action");
const { parseCardChange } = require("../helpers/helpers");

const createAction = (req, res, next) => {
  const cardReq = req.card;
  const { card } = req.body;
  if (card) {
    let actionMessage = parseCardChange(card, cardReq);
    if (actionMessage) {
      Action.create({
        description: actionMessage,
        cardId: cardReq._id
      }).then(action => {
        req.action = action;
        next();
      });
    } else {
      next();
    }
  } else {
    Action.create({
      description: "Card was created",
      cardId: cardReq._id
    }).then(action => {
      req.action = action;
      next();
    });
  }
};

exports.createAction = createAction;
