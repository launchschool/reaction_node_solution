import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { boardListsSelector } from "../../selectors/listSelectors";
import ListWrapper from "../list/ListWrapper";
import { useSelector } from "react-redux";

const ExistingLists = (props) => {
  const stateLists = useSelector((state) => state.lists);
  const lists = boardListsSelector(stateLists, props.boardId);

  const [addCardActiveListId, setAddCardActiveListId] = useState(null);

  const handleAddCardClick = (id) => {
    setAddCardActiveListId(id);
  };

  const handleAddCardClose = () => {
    setAddCardActiveListId(null);
  };

  const sortedLists = lists.sort((a, b) => {
    if (a.position > b.position) {
      return 1;
    }
    if (a.position < b.position) {
      return -1;
    }
    return 0;
  });

  return (
    <div id="existing-lists" className="existing-lists">
      <DndProvider backend={HTML5Backend}>
        {sortedLists.map((list) => (
          <ListWrapper
            list={list}
            key={list._id}
            lists={sortedLists}
            addCardActive={addCardActiveListId === list._id}
            onAddCardClick={handleAddCardClick}
            onAddCardClose={handleAddCardClose}
          />
        ))}
      </DndProvider>
    </div>
  );
};

export default ExistingLists;
