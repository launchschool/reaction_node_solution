import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import calculatePosition from "../../lib/PositionCalculator";
import { updateCard } from "../../actions/CardActions";

const ListCard = ({ card, cards }) => {
  const dispatch = useDispatch();
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "CARD",
      item: { ...card },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0 : 1,
      }),
    }),
    [card]
  );

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "CARD",
      drop: (item) => {
        let idx = cards.findIndex((c) => c._id === card._id);
        dispatch(
          updateCard(item._id, {
            listId: card.listId,
            position: calculatePosition(cards, idx),
          })
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [dispatch, cards, card]
  );

  const { _id, title, labels, description } = card;
  return (
    <Link to={`/cards/${_id}`} data-card-id={_id}>
      <div className="card-background" ref={dropRef}>
        <div
          className="card "
          ref={dragRef}
          style={{ opacity, backgroundColor: isOver ? "#a6a6a6" : "" }}
        >
          <i className="edit-toggle edit-icon sm-icon"></i>
          <div className="card-info">
            {labels
              ? labels.map((label, idx) => (
                  <div
                    key={idx}
                    className={`card-label ${label} colorblindable`}
                  ></div>
                ))
              : null}
            <p>{title}</p>
          </div>
          <div className="card-icons">
            {description ? <i className="description-icon sm-icon"></i> : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListCard;
