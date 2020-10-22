import React, { useReducer, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardModal from "./CardModal";
import * as actions from "../../actions/CardActions";
import LabelsForm from "./LabelsForm";
import Popover from "../shared/Popover";

const CardModalContainer = (props) => {
  const reducer = (prevState, updatedProperty) => ({
    ...prevState,
    ...updatedProperty,
  });

  const initState = {
    card: undefined,
    popover: {
      visible: false,
      attachedTo: null,
      type: null,
    },
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
    updateCardInState(card);
  }, [updateCardInState, card]);

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

  const handleShowPopover = useCallback((e, type) => {
    e.stopPropagation();

    setState({
      popover: {
        type,
        attachedTo: e.target,
        visible: true,
      },
    });
  }, []);

  const onClosePopover = useCallback(() => {
    setState({
      popover: {
        type: null,
        attachedTo: null,
        visible: false,
      },
    });
  }, []);

  const handleClosePopover = useCallback(
    (e) => {
      e.preventDefault();
      onClosePopover();
    },
    [onClosePopover]
  );

  const handleToggleLabel = useCallback(
    (e, label) => {
      const currentLabels = state.card.labels;
      let labels;

      if (currentLabels.indexOf(label) === -1) {
        labels = currentLabels.concat(label);
      } else {
        labels = currentLabels.filter((currentLabel) => currentLabel !== label);
      }
      if (state.card) {
        updateCard(state.card._id, { labels });
      }
    },
    [state.card, updateCard]
  );

  const popoverChildren = useCallback(() => {
    const type = state.popover.type;
    const visible = state.popover.visible;
    if (visible && type) {
      switch (type) {
        case "due-date":
          // return (
          //   <DueDateForm
          //     dueDate={state.card.dueDate}
          //     onClose={handleClosePopover}
          //     onSubmit={handleDueDateSubmit}
          //     onRemove={handleDueDateRemove}
          //   />
          // );
        case "labels":
          return (
            <LabelsForm
              selectedLabels={state.card.labels}
              onClose={handleClosePopover}
              onClickLabel={handleToggleLabel}
            />
          );
        // case "copy-card":
        //   return (
        //     <CopyCardFormContainer
        //       onClose={handleClosePopover}
        //       card={state.card}
        //     />
        //   );
        // case "move-card":
        //   return (
        //     <MoveCardForm onClose={handleClosePopover} card={state.card} />
        //   );
        default:
          return null;
      }
    }
  }, [
    handleClosePopover,
    // handleDueDateSubmit,
    // handleDueDateRemove,
    handleToggleLabel,
    state.card,
    state.popover.type,
    state.popover.visible,
  ]);

  if (state.card && list) {
    return (
      <>
        <CardModal
          title={title}
          card={state.card}
          list={list}
          onTitleBlur={handleTitleBlur}
          onTitleChange={handleTitleChange}
          onShowPopover={handleShowPopover}
          onUpdateCard = {updateCard}
        />
        <Popover {...state.popover}>{popoverChildren()}</Popover>
      </>
    );
  } else {
    return null;
  }
};

export default CardModalContainer;
