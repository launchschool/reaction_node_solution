import React from "react";
import ListCards from "./ListCards";
import EditableListTitle from "./EditableListTitle";
import ToggleableAddCard from "./ToggleableAddCard";

const ListWrapper = (props) => {
  const classList = props.addCardActive
    ? "list-wrapper add-dropdown-active"
    : "list-wrapper";
  return (
    <div className={classList}>
      <div className="list-background">
        <div className="list">
          <a className="more-icon sm-icon" href=""></a>
          <div>
            <EditableListTitle listId={props._id} title={props.title} />
          </div>
          <div className="add-dropdown add-top">
            <div className="card"></div>
            <a className="button">Add</a>
            <i className="x-icon icon"></i>
            <div className="add-options">
              <span>...</span>
            </div>
          </div>
          <ListCards listId={props._id} />
          <ToggleableAddCard
            listId={props._id}
            openedAddCard={props.addCardActive}
            onAddCardClick={props.onAddCardClick}
            onAddCardClose={props.onAddCardClose}
          />
        </div>
      </div>
    </div>
  );
}

export default ListWrapper;