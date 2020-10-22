import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import dragula from "react-dragula";
import ListWrapper from "../list/ListWrapper";
import * as cardSelectors from "../../selectors/cardSelectors";
import calculatePosition from "../../lib/PositionCalculator";
import { boardListsSelector } from "../../selectors/listSelectors";
import * as actions from "../../actions/CardActions";

const ExistingLists = (props) => {
  const stateLists = useSelector((state) => state.lists);
  const lists = boardListsSelector(stateLists, props.boardId);
  const dispatch = useDispatch();

  const updateCard = useCallback(
    (cardId, updatedCard, callback) => {
      dispatch(actions.updateCard(cardId, updatedCard, callback));
    },
    [dispatch]
  );

  const [addCardActiveListId, setAddCardActiveListId] = useState(null);

  const handleAddCardClick = (id) => {
    setAddCardActiveListId(id);
  };

  const handleAddCardClose = () => {
    setAddCardActiveListId(null);
  };

  const state = useSelector((state) => state);

  useEffect(() => {
    let cardDrake = dragula({
      isContainer: function (el) {
        return el.id === "cards-container";
      },
    });

    cardDrake.on("drop", (el) => {
      const droppedEl = el;
      const cardId = el.dataset.cardId;
      const list = el.closest(".list-wrapper");
      const listId = list.dataset.listId;
      const siblings = Array.prototype.slice.call(
        droppedEl.parentNode.childNodes
      );
      const cards = cardSelectors.listCards(state.cards, listId);
      const targetIndex = siblings.indexOf(droppedEl);
      const sortedStartingCards = cards
        .slice()
        .sort((a, b) => a.position - b.position);
      let sourceIndex = sortedStartingCards.findIndex(
        (card) => card._id === cardId
      );
      if (sourceIndex === -1) sourceIndex = null;

      const newPosition = calculatePosition(cards, targetIndex, sourceIndex);

      el.setAttribute("style", `${el.style.cssText};display: none;`);

      cardDrake.cancel(true);

      updateCard(
        cardId,
        {
          position: newPosition,
          listId,
        },
        () => {
          el.setAttribute(
            "style",
            el.style.cssText.replace("display: none;", "")
          );
        }
      );
    });
    return () => {
      cardDrake.destroy();
    };
  }, [state, updateCard]);

  const dragulaDecorator = useCallback((componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = {
        direction: "horizontal",
        moves: function (el, source, handle, sibling) {
          return !handle.closest("#cards-container");
        },
        accepts: function (el, target, source, sibling) {
          return !el.closest("#cards-container");
        },
      };

      dragula([componentBackingInstance], options).on("drop", function (el) {
        el.dispatchEvent(new Event("drop", { bubbles: true }));
      });
    }
  }, []);

  const sortedLists = () => {
    const listCopy = lists.slice();
    return listCopy.sort((a, b) => a.position - b.position);
  };

  return (
    <div id="existing-lists" className="existing-lists" ref={dragulaDecorator}>
      {sortedLists().map((list) => (
        <ListWrapper
          key={list._id}
          {...list}
          addCardActive={addCardActiveListId === list._id}
          onAddCardClick={handleAddCardClick}
          onAddCardClose={handleAddCardClose}
        />
      ))}
    </div>
  );
};

export default ExistingLists;
