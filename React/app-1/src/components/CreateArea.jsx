import React, { useState } from "react";
import AddCommentIcon from "@material-ui/icons/AddComment";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  const [click, setClick] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  function handleZoom() {
    setClick(true);
  }

  return (
    <div>
      <form className="create-note">
        <input
          hidden={!click}
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        <textarea
          onClick={handleZoom}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={click ? "3" : "1"}
        />
        <Zoom in={click}>
          <Fab onClick={submitNote} hidden={!click}>
            <AddCommentIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
