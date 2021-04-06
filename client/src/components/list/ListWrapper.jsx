import React from "react";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import calculatePosition from "../../lib/PositionCalculator";
import { updateList } from "../../actions/ListActions";
import ListCards from "./ListCards";
import EditableListTitle from "./EditableListTitle";
import ToggleableAddCard from "./ToggleableAddCard";

const ListWrapper = ({
  list,
  lists,
  addCardActive,
  onAddCardClick,
  onAddCardClose,
}) => {
  // const stateLists = useSelector((state) => state.lists);
  // const lists = boardListsSelector(stateLists, list.boardId);

  // const sortedLists = (lists) => {
  //   return lists.sort((a, b) => a.position - b.position);
  // };

  const [{ isDragging }, dragRef] = useDrag({
    type: "LIST",
    item: { _id: list._id, title: list.title, position: list.position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // const stateLists = useSelector((state) => state.lists);
  // const lists = boardListsSelector(stateLists, list.boardId);

  const opacity = isDragging ? 0.4 : 1;

  const dispatch = useDispatch();

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "LIST",
      drop: (item) => {
        let orgPos = lists.findIndex((l) => l._id === item._id);
        let targetPos = lists.findIndex((l) => l._id === list._id);
        dispatch(
          updateList(item._id, {
            position: calculatePosition(lists, targetPos, orgPos),
          })
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [list, lists, dispatch]
  );

  return (
    <div
      ref={dropRef}
      style={{ minHeight: "15px" }}
      className={`list-wrapper ${addCardActive ? "add-dropdown-active" : ""}`}
    >
      <div className="list-background">
        <div
          className="list"
          ref={dragRef}
          style={{ opacity, backgroundColor: isOver ? "#a6a6a6" : "" }}
        >
          <a className="more-icon sm-icon" href=""></a>
          <EditableListTitle listId={list._id} title={list.title} />
          <div className="add-dropdown add-top">
            <div className="card"></div>
            <a className="button">Add</a>
            <i className="x-icon icon"></i>
            <div className="add-options">
              <span>...</span>
            </div>
          </div>
          <ListCards listId={list._id} />
          <ToggleableAddCard
            listId={list._id}
            openedAddCard={addCardActive}
            onAddCardClick={onAddCardClick}
            onAddCardClose={onAddCardClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ListWrapper;
