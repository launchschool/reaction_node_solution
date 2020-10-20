import React from "react";
import ListCards from "./ListCards";

const ListWrapper = (props) => {
  return (
    <div class="list-wrapper">
      <div class="list-background">
        <div class="list">
          <a class="more-icon sm-icon" href=""></a>
          <div>
            <p class="list-title">Stuff to try (this is a list)</p>
          </div>
          <div class="add-dropdown add-top">
            <div class="card"></div>
            <a class="button">Add</a>
            <i class="x-icon icon"></i>
            <div class="add-options">
              <span>...</span>
            </div>
          </div>
          <ListCards listId={props._id} />
          <div class="add-dropdown add-bottom">
            <div class="card">
              <div class="card-info"></div>
              <textarea name="add-card"></textarea>
              <div class="members"></div>
            </div>
            <a class="button">Add</a>
            <i class="x-icon icon"></i>
            <div class="add-options">
              <span>...</span>
            </div>
          </div>
          <div class="add-card-toggle" data-position="bottom">
            Add a card...
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListWrapper;