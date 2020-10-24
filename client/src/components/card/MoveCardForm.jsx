import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import _isEqual from "lodash/isEqual";
import CardLocationFormContainer from "./CardLocationFormContainer";
import * as cardSelectors from "../../selectors/cardSelectors";
import calculatePosition from "../../lib/PositionCalculator";
import * as actions from "../../actions/CardActions";

const MoveCardForm = (props) => {
  const [boardIdLocation, setBoardIdLocation] = useState(undefined);
  const [listIdLocation, setListIdLocation] = useState(undefined);
  const [positionLocation, setPositionLocation] = useState(undefined);
  const history = useHistory();

  const stateCards = useSelector((state) => state.cards);

  const dispatch = useDispatch();

  const updateCard = useCallback(
    (cardId, card, callback) => {
      dispatch(actions.updateCard(cardId, card, callback));
    },
    [dispatch]
  );

  const handleLocationChange = useCallback((boardId, listId, position) => {
    setBoardIdLocation(boardId);
    setListIdLocation(listId);
    setPositionLocation(position);
  }, []);

  const isSubmitDisabled = useCallback(() => {
    return (
      boardIdLocation == null ||
      listIdLocation == null ||
      positionLocation == null
    );
  }, [boardIdLocation, listIdLocation, positionLocation]);

  const handleSubmit = useCallback(
    (e) => {
      if (isSubmitDisabled()) {
        return;
      }

      e.preventDefault();

      const listCards = cardSelectors.listCards(
        stateCards,
        listIdLocation,
        (a, b) => {
          return a.position - b.position;
        }
      );

      const sourceBoardId = props.card.boardId;
      const changingBoard = boardIdLocation !== sourceBoardId;

      const currentIndex = listCards.findIndex(
        (card) => card._id === props.card._id
      );

      updateCard(
        props.card._id,
        {
          listId: listIdLocation,
          position: calculatePosition(
            listCards,
            positionLocation,
            currentIndex
          ),
        },
        () => {
          if (changingBoard) {
            history.push(`/boards/${sourceBoardId}`);
          } else {
            props.onClose(new Event("click"));
          }
        }
      );
    },
    [
      isSubmitDisabled,
      updateCard,
      boardIdLocation,
      listIdLocation,
      positionLocation,
      props,
    ]
  );
  return (
    <div>
      <header>
        <span>Move Card</span>
        <a href="#" className="icon-sm icon-close" onClick={props.onClose}></a>
      </header>
      <div className="content">
        <CardLocationFormContainer
          card={props.card}
          onLocationChange={handleLocationChange}
        />
        <button
          className="button"
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
        >
          Move
        </button>
      </div>
    </div>
  );
};

export default MoveCardForm;
