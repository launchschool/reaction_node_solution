import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import useInput from "../../hooks/useInput";
import * as actions from "../../actions/CommentActions";

const NewCommentForm = (props) => {
  const { value: comment, bind: bindComment, reset: resetComment } = useInput(
    ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();

  const submit = useCallback(
    (comment, callback) => {
      dispatch(actions.createComment(props.cardId, comment, callback));
    },
    [dispatch, props.cardId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSaving(true);

    submit(comment, resetState);
  };

  const resetState = () => {
    resetComment();
    setIsSaving(false);
  };
  return (
    <React.Fragment>
      <h2 className="comment-icon icon">Add Comment</h2>
      <div>
        <div className="member-container">
          <div className="card-member">TP</div>
        </div>
        <div className="comment">
          <label>
            <textarea
              required=""
              rows="1"
              placeholder="Write a comment..."
              {...bindComment}
            ></textarea>
            <div>
              <a className="light-button card-icon sm-icon"></a>
              <a className="light-button smiley-icon sm-icon"></a>
              <a className="light-button email-icon sm-icon"></a>
              <a className="light-button attachment-icon sm-icon"></a>
            </div>
            <div>
              <input
                type="submit"
                className="button"
                value={isSaving ? "Saving..." : "Save"}
                onClick={handleSubmit}
              />
            </div>
          </label>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewCommentForm;
