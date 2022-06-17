import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import contactReducer from "./contactReducer";
import messagesReducer from "./messagesReducer";

export default configureStore({
	reducer: {
		user: userReducer,
		contact: contactReducer,
		messages: messagesReducer,
	},
});
