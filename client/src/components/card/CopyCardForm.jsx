import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _isEqual from "lodash/isEqual";
import CardLocationFormContainer from "./CardLocationFormContainer";
import * as cardSelectors from "../../selectors/cardSelectors";
import * as commentSelector from "../../selectors/commentSelectors";
import calculatePosition from "../../lib/PositionCalculator";
import * as actions from "../../actions/CardActions";

const CopyCardForm = (props) => {
  const [boardIdLocation, setBoardIdLocation] = useState(undefined);
  const [listIdLocation, setListIdLocation] = useState(undefined);
  const [positionLocation, setPositionLocation] = useState(undefined);
  const [title, setTitle] = useState("");
  const [keepComments, setKeepComments] = useState(true);

  const state = useSelector((state) => state);

  const cardComments = commentSelector.cardComments(state.comments, props.card._id);

  const commentsCount = cardComments.length;

  useEffect(() => {
    setTitle(props.card.title);
  }, [])

  const dispatch = useDispatch();

  const createCard = useCallback(
    (listId, card, callback) => {
      dispatch(actions.createCard(listId, card, callback));
    },
    [dispatch]
  );

  const handleKeepCommentsChange = e => {
    setKeepComments(e.target.checked);
  }

  const handleTitleChange = e => {
    setTitle(e.target.value);
  }

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
        state.cards,
        listIdLocation,
        (a, b) => {
          return a.position - b.position;
        }
      );

      const sourceBoardId = props.card.boardId;
      const changingBoard = boardIdLocation !== sourceBoardId;

      createCard(
        listIdLocation,
        {
          title,
          copyFrom: props.card._id,
          position: calculatePosition(
            listCards,
            positionLocation,
          ),
          keep: {
            keepComments,
            cardComments
          }
        },
        () => {
          if (changingBoard) {
            props.history.push(`/boards/${sourceBoardId}`);
          } else {
            props.onClose(new Event("click"));
          }
        }
      );
    },
    [
      isSubmitDisabled,
      createCard,
      title,
      positionLocation,
      props,
    ]
  );

  return (
    <div>
      <header>
        <span>Copy Card</span>
        <a
          href="#"
          className="icon-sm icon-close"
          onClick={props.onClose}
        ></a>
      </header>
      <div className="content">
        <label>Title</label>
        <textarea
          name="name"
          style={{ marginBottom: "12px" }}
          value={title}
          onChange={handleTitleChange}
        ></textarea>

        {commentsCount ? (
          <div>
            <label>Keep…</label>
            <div className="check-div clearfix">
              <input
                id="keep-comments"
                type="checkbox"
                name="comments"
                checked={keepComments}
                onChange={handleKeepCommentsChange}
              />
              <label htmlFor="keep-comments">
                Comments <span className="quiet">({commentsCount})</span>
              </label>
            </div>
            <br />
          </div>
        ) : null}

        <label>Copy to…</label>
        <CardLocationFormContainer
          card={props.card}
          onLocationChange={handleLocationChange}
          mode="copy"
        />

        <button className="button" type="submit" onClick={handleSubmit}>
          Create Card
        </button>
      </div>
    </div>
  );
};

export default CopyCardForm;
