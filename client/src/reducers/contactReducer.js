import { createSlice } from "@reduxjs/toolkit";

export const contactSlice = createSlice({
	name: "contact",
	initialState: {
		user: {},
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { setUser } = contactSlice.actions;

export default contactSlice.reducer;
