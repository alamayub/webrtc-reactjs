import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  partnerUser: null,
  messages: [],
  typing: false,
  localStream: null,
  remoteStream: null,
  peerConnection: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setPartnerUser: (state, action) => {
      state.partnerUser = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action) => {
      state.typing = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setPeerConnection: (state, action) => {
      state.peerConnection = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setPartnerUser,
  addMessage,
  setTyping,
  setLocalStream,
  setRemoteStream,
  setPeerConnection,
} = chatSlice.actions;

const store = configureStore({
  reducer: chatSlice.reducer,
});

export default store;
