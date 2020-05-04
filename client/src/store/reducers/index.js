import { createReducer } from "@reduxjs/toolkit";

const initState = {
    audioFiles: []
};

const mainReducer = createReducer(initState, {
  INIT_AUDIO_FILES: (state, action) => {
    state.audioFiles = action.data;
  },
  EDIT_AUDIO_FILE: (state, action) => {
    state.audioFiles[action.index].name = action.newName
  },
  DELETE_AUDIO_FILE: (state, action) => {
    state.audioFiles.splice(action.index, 1)
  }
});

export default mainReducer;
