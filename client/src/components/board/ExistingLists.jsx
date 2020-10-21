import React, {useState} from "react";
import ListWrapper from "../list/ListWrapper";
import { useSelector } from "react-redux";
import { boardListsSelector } from "../../selectors/listSelectors";

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

  return (
    <div id="existing-lists" className="existing-lists">
      {lists.map((list) => (
        <ListWrapper
          key={list._id}
          {...list}
          addCardActive={addCardActiveListId === list._id}
          onAddCardClick={handleAddCardClick}
          onAddCardClose={handleAddCardClose}
        />
      ))}
    </div>
  );
}

export default ExistingLists;