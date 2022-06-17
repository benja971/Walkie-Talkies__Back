import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
	name: "messages",
	initialState: {
		showMessages: false,
		discussionId: "",
		messages: [],
	},
	reducers: {
		toggleMessages: (state, action) => {
			state.showMessages = !state.showMessages;
		},
		setDiscussionId: (state, action) => {
			state.discussionId = action.payload;
		},
		setMessages: (state, action) => {
			state.messages = action.payload;
		},
		addMessage: (state, action) => {
			// check if message is already in the list
			const message = action.payload;

			const messageAlreadyExists = state.messages.some(m => {
				const sameSender = m.sender._id === message.sender._id;
				const sameText = m.text === message.text;
				const sameDate = m.date === message.date;

				return sameSender && sameText && sameDate;
			});

			!messageAlreadyExists && (state.messages = [...state.messages, action.payload]);
		},
	},
});

export const { toggleMessages, setDiscussionId, setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
