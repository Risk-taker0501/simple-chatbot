import React from "react";
import "./editable-item.css";

const EditableItem = props => {
  const {
    title,
    changeTitle,
    title1,
    changeTitle1,
    removeNode,
    addChild,
    children
  } = props;
  const hasChildren = children !== undefined;

  return (
    <div className="EditableItem">
      <button
        className="EditableItem-Button EditableItem-Button_add"
        onClick={addChild}
      >
        +
      </button>

      <button
        className="EditableItem-Button EditableItem-Button_remove"
        onClick={removeNode}
      >
        x
      </button>

      <input
        className="EditableItem-Text"
        onChange={e => {
          changeTitle(e.target.value);
        }}
        value={title}
        placeholder="New message"
      />
      {hasChildren && (
        <input
          className="EditableItem-Text"
          onChange={e => {
            changeTitle1(e.target.value);
          }}
          value={title1}
          placeholder="Next option question"
        />
      )}
    </div>
  );
};

export default EditableItem;
