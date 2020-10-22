import React, { useReducer, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardModal from "./CardModal";
import * as actions from "../../actions/CardActions";

const CardModalContainer = (props) => {
  const reducer = (prevState, updatedProperty) => ({
    ...prevState,
    ...updatedProperty,
  });

  const initState = {
    card: undefined,
  };

  const [title, setTitle] = useState("");
  const [state, setState] = useReducer(reducer, initState);

  const card = useSelector((state) =>
    state.cards.find((card) => card._id === props.match.params.id)
  );

  const list = useSelector((state) =>
    state.lists.find((list) => list._id === card.listId)
  );

  const dispatch = useDispatch();

  const updateCard = useCallback(
    (id, attrs, callback) => {
      dispatch(actions.updateCard(id, attrs, callback));
    },
    [dispatch]
  );

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = useCallback(
    (e) => {
      e.preventDefault();
      if (state.card) {
        updateCard(state.card._id, { title });
      }
    },
    [state.card, title, updateCard]
  );

  const fetchCard = useCallback((callback) => {
    dispatch(actions.fetchCard(props.match.params.id, callback));
  }, [dispatch, props.match.params.id]);

  const updateCardInState = useCallback((newCard) => {
    if (newCard) {
      setState({
        card: newCard,
        title: newCard.title,
      });
    }
  }, []);

  useEffect(() => {
    fetchCard((newCard) => {
      updateCardInState(newCard);
    });
  }, [fetchCard, updateCardInState]);


  useEffect(() => {
    if (card) {
      setTitle(card.title);
    }
  }, [card]);

  if (state.card && list) {
    return (
      <>
        <CardModal
          title={title}
          card={state.card}
          list={list}
          onTitleBlur={handleTitleBlur}
          onTitleChange={handleTitleChange}
          onUpdateCard = {updateCard}
        />
      </>
    );
  } else {
    return null;
  }
};

export default CardModalContainer;
