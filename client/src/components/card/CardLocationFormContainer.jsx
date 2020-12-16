import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardLocationForm from "./CardLocationForm";
import * as listSelectors from "../../selectors/listSelectors";
import * as cardSelectors from "../../selectors/cardSelectors";
import * as boardActions from "../../actions/BoardActions";

const sortByTitle = (a, b) => {
  if (!a || !b) return -1;
  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();

  if (aTitle < bTitle) return -1;
  if (aTitle > bTitle) return 1;
  return 0;
};

const CardLocationFormContainer = (props) => {
  const [selectedBoard, setSelectedBoard] = useState(undefined);
  const [first, setFirst] = useState(true);

  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(undefined);
  const [selectedList, setSelectedList] = useState(undefined);
  const [boardsFetched, setBoardsFetched] = useState(false);

  const stateBoards = useSelector((state) => state.boards);
  const stateLists = useSelector((state) => state.lists);
  const stateCards = useSelector((state) => state.cards);

  const propsBoards = stateBoards.sort(sortByTitle);

  const propsLists = listSelectors
    .boardListsSelector(stateLists, props.card.boardId)
    .sort(sortByTitle);

  const [lists, setLists] = useState(propsLists);

  const propsCards = cardSelectors
    .listCards(stateCards, props.card.listId)
    .sort((a, b) => a.position - b.position);
  const dispatch = useDispatch();

  const fetchBoard = useCallback(
    (id, callback) => {
      dispatch(boardActions.fetchBoard(id, callback));
    },
    [dispatch]
  );

  const fetchBoards = useCallback(
    (callback) => {
      dispatch(boardActions.fetchBoards(callback));
    },
    [dispatch]
  );

  const currentCardPositionIndex = useCallback(() => {
    const cards = propsCards;
    let currentPosition = cards.findIndex(
      (card) => card._id === props.card._id
    );
    if (currentPosition === -1) currentPosition = undefined;

    return currentPosition;
  }, [props.card._id, propsCards]);

  const selectBoard = useCallback(
    (id) => {
      fetchBoard(id, (board) => {
        const newLists = board.lists.sort(sortByTitle);

        setSelectedBoard(board);
        setLists(newLists);
        setFirst(true);
      });
    },
    [fetchBoard]
  );

  const selectPosition = useCallback(
    (position) => {
      if (position === "bottom") {
        position = positions[positions.length - 1];
      }

      if (position != null) {
        setSelectedPosition(position);
      } else {
        setSelectedPosition(positions[0]);
      }
    },
    [positions]
  );

  useEffect(() => {
    const boardIdLocation = selectedBoard && selectedBoard._id;
    const listIdLocation = selectedList && selectedList._id;
    const positionLocation = selectedPosition;
    props.onLocationChange(boardIdLocation, listIdLocation, positionLocation);
  }, [selectedBoard, selectedList, selectedPosition, props]);

  const selectList = useCallback(
    (id) => {
      let list;
      const positions = [];
      if (id) {
        list = lists.find((list) => list._id === id);
      } else {
        list = lists[0];
      }

      if (list) {
        const cards = cardSelectors
          .listCards(stateCards, list._id)
          .sort((a, b) => a.position - b.position);
        let currentPosition = cards.findIndex(
          (card) => card._id === props.card._id
        );
        if (currentPosition === -1) currentPosition = undefined;

        let potentialPositionsLength;

        if (currentPosition === undefined || props.mode === "copy") {
          potentialPositionsLength = cards.length + 1;
        } else {
          potentialPositionsLength = cards.length;
        }

        for (let i = 0; i < potentialPositionsLength; i++) {
          positions.push(i);
        }
      }
      setSelectedList(list);
      setPositions(positions);
    },
    [lists, props.card._id, props.mode, stateCards]
  );

  useEffect(() => {
    if (
      selectedBoard !== undefined &&
      selectedList !== undefined &&
      selectedList !== undefined
    ) {
      return;
    }
    if (selectedBoard && selectedList) {
      if (
        selectedBoard._id === props.card.boardId &&
        selectedList._id === props.card.listId &&
        props.mode !== "copy"
      ) {
        selectPosition(currentCardPositionIndex());
      } else {
        selectPosition("bottom");
      }
    }
  }, [
    selectedBoard,
    selectedList,
    currentCardPositionIndex,
    props.card.boardId,
    props.card.listId,
    props.mode,
    selectPosition,
  ]);

  useEffect(() => {
    if (selectedBoard) {
      if (selectedBoard._id === props.card.boardId) {
        selectList(props.card.listId);
        setFirst(false);
      } else if (lists.length) {
        selectList(lists[0]._id);
        setFirst(false);
      } else {
        selectList();
        setFirst(false);
      }
    }
  }, [props.card.boardId, selectedBoard, lists, selectList, props.card.listId]);

  useEffect(() => {
    if (first) {
      selectList(props.card.listId);
    }
  }, [props.card.listId, selectList, first]);

  useEffect(() => {
    if (boardsFetched) {
      return;
    }
    fetchBoards();
    setSelectedBoard(
      propsBoards.find((board) => {
        return board._id === props.card.boardId;
      })
    );
    setSelectedPosition(currentCardPositionIndex());
    setBoardsFetched(true);
  }, [
    fetchBoards,
    propsBoards,
    currentCardPositionIndex,
    props.card.boardId,
    boardsFetched,
  ]);

  const handleBoardChange = useCallback(
    (e) => {
      const selectedValue = e.target.value;
      selectBoard(selectedValue);
    },
    [selectBoard]
  );

  const handleListChange = useCallback(
    (e) => {
      const selectedValue = e.target.value;
      selectList(selectedValue);
    },
    [selectList]
  );

  const handlePositionChange = useCallback(
    (e) => {
      const selectedValue = +e.target.value;

      selectPosition(selectedValue);
    },
    [selectPosition]
  );

  const selectedPositionHumanIndex = useCallback(() => {
    if (selectedPosition == null) {
      return "N/A";
    } else {
      return selectedPosition + 1;
    }
  }, [selectedPosition]);

  const selectedBoardTitle = useCallback(() => {
    if (selectedBoard) {
      return selectedBoard.title;
    } else {
      return "No Boards";
    }
  }, [selectedBoard]);

  const selectedBoardId = useCallback(() => {
    if (selectedBoard) {
      return selectedBoard._id;
    } else {
      return undefined;
    }
  }, [selectedBoard]);

  const selectedListTitle = useCallback(() => {
    if (selectedList) {
      return selectedList.title;
    } else {
      return "No Lists";
    }
  }, [selectedList]);

  const selectedListId = useCallback(() => {
    if (selectedList) {
      return selectedList._id;
    } else {
      return undefined;
    }
  }, [selectedList]);

  const isSubmitDisabled = useCallback(() => {
    return (
      selectedBoard == null || selectedList == null || selectedPosition == null
    );
  }, [selectedBoard, selectedList, selectedPosition]);

  return (
    <CardLocationForm
      boards={propsBoards}
      lists={lists}
      positions={positions}
      selectedBoardId={selectedBoardId()}
      selectedBoardTitle={selectedBoardTitle()}
      selectedListId={selectedListId()}
      selectedListTitle={selectedListTitle()}
      selectedPosition={selectedPosition}
      currentPosition={currentCardPositionIndex()}
      selectedPositionHumanIndex={selectedPositionHumanIndex()}
      onPositionChange={handlePositionChange}
      currentBoardId={props.card.boardId}
      currentListId={props.card.listId}
      onBoardChange={handleBoardChange}
      onListChange={handleListChange}
      isSubmitDisabled={isSubmitDisabled()}
    />
  );
};

export default CardLocationFormContainer;
