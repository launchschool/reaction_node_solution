import React from "react";
import ListCard from "./ListCard";
import { useSelector, useDispatch } from "react-redux";
import { listCards } from "../../selectors/cardSelectors";
import { updateCard } from "../../actions/CardActions";
import { useDrop } from "react-dnd";

const sortedCards = (cards) => {
  return cards.sort((a, b) => a.position - b.position);
};

const ListCards = ({ listId }) => {
  const stateCards = useSelector((state) => state.cards);
  const cards = listCards(stateCards, listId);
  const sortedC = sortedCards(cards);

  const dispatch = useDispatch();

  const [{ overFirst }, dropFirst] = useDrop(
    () => ({
      accept: "CARD",
      drop: (item) => {
        let position;
        if (sortedC.length === 0) {
          position = 65535;
        } else {
          position = sortedC[0].position / 2;
        }

        dispatch(
          updateCard(item._id, {
            listId: listId,
            position,
          })
        );
      },
      collect: (monitor) => ({
        overFirst: !!monitor.isOver(),
      }),
    }),
    [dispatch, sortedC, listId]
  );

  let [{ overLast }, dropLast] = useDrop(
    () => ({
      accept: "CARD",
      drop: (item) => {
        let position = sortedC[sortedC.length - 1].position + 65536;
        dispatch(
          updateCard(item._id, {
            listId: listId,
            position,
          })
        );
      },
      collect: (monitor) => ({
        overLast: !!monitor.isOver(),
      }),
    }),
    [dispatch, sortedC, listId]
  );

  const firstHeight = overFirst ? "30px" : "10px";
  const lastHeight = overLast ? "30px" : "10px";

  return (
    <div id="cards-container">
      <div
        id="first"
        style={{
          minHeight: firstHeight,
          backgroundColor: overFirst ? "#a6a6a6" : "",
        }}
        ref={dropFirst}
      ></div>

      {sortedC.map((card) => (
        <ListCard key={card._id} cards={sortedC} card={card}></ListCard>
      ))}
      {sortedC.length !== 0 ? (
        <div
          id="last"
          ref={dropLast}
          style={{
            minHeight: lastHeight,
            backgroundColor: overLast ? "#a6a6a6" : "",
          }}
        ></div>
      ) : null}
    </div>
  );
};

export default ListCards;
