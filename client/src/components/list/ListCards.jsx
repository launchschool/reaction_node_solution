import React from "react";
import { useSelector } from "react-redux";
import ListCard from "./ListCard";
import { listCards } from "../../selectors/cardSelectors";

const sortedCards = (cards) => {
  const copy = cards.slice();
  return copy.sort((a, b) => a.position - b.position);
};
const ListCards = ({ listId }) => {
  const stateCards = useSelector((state) => state.cards);
  const cards = listCards(stateCards, listId);
  console.log(sortedCards(cards));
  return (
    <div id="cards-container">
      {sortedCards(cards).map((card) => {
        return <ListCard key={card._id} {...card} />;
      })}
    </div>
  );
};

export default ListCards;
