import React, { useReducer, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import CardModal from "./CardModal";
import * as actions from "../../actions/CardActions";
import LabelsForm from "./LabelsForm";
import Popover from "../shared/Popover";
import DueDateForm from "./DueDateForm";
import * as commentSelectors from "../../selectors/commentSelectors";
import * as commentActions from "../../actions/CommentActions";

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


  const stateComments = useSelector((state) => state.comments);
  // const stateActions = useSelector((state) => state.actions);
  const comments = commentSelectors.cardCommentsAndActions(
    stateComments,
    [],
    props.match.params.id,
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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

  const handleToggleCompleted = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (card && state.card) {
        updateCard(card._id, {
          completed: !state.card.completed,
        });
      }
    },
    [card, state.card, updateCard]
  );

  const createComment = useCallback(
    (cardId, comment, callback) => {
      dispatch(commentActions.createComment(cardId, comment, callback));
    },
    [dispatch]
  );

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

  const handleDueDateSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const date = e.target.querySelector(".datepicker-select-date input")
        .value;
      const time = e.target.querySelector(".datepicker-select-time input")
        .value;
      const dateTime = `${date} ${time}`;
      if (state.card) {
        updateCard(
          state.card._id,
          { dueDate: moment(dateTime, "M/D/YYYY h:mm A").toISOString() },
          () => {
            onClosePopover();
          }
        );
      }
    },
    [onClosePopover, state.card, updateCard]
  );

  const handleDueDateRemove = useCallback(
    (e) => {
      e.preventDefault();
      if (state.card) {
        updateCard(state.card._id, { dueDate: null, completed: false }, () => {
          onClosePopover();
        });
      }
    },
    [state.card, updateCard, onClosePopover]
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
          return (
            <DueDateForm
              dueDate={state.card.dueDate}
              onClose={handleClosePopover}
              onSubmit={handleDueDateSubmit}
              onRemove={handleDueDateRemove}
            />
          );
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
    handleDueDateSubmit,
    handleDueDateRemove,
    handleToggleLabel,
    state.card,
    state.popover.type,
    state.popover.visible,
  ]);

  const handleToggleArchive = useCallback(() => {
    if (card) {
      updateCard(card._id, {
        archived: !card.archived,
      });
    }
  }, [card, updateCard]);

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
          onUpdateCard={updateCard}
          comments={comments}
          onCreateComment={createComment}
          onToggleCompleted={handleToggleCompleted}
          onToggleArchive={handleToggleArchive}
        />
        <Popover {...state.popover}>{popoverChildren()}</Popover>
      </>
    );
  } else {
    return null;
  }
};

export default CardModalContainer;
