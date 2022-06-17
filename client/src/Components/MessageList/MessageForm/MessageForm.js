import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

import { addMessage } from "../../../reducers/messagesReducer";

import "./MessageForm.scss";

const ENDPOINT = "http://127.0.0.1:8080";

export default function MessageForm() {
	const [message, setMessage] = useState("");

	const { user } = useSelector(state => state.user);
	const { discussionId } = useSelector(state => state.messages);

	const socket = useMemo(() => socketIOClient(ENDPOINT), []);

	const dispatch = useDispatch();

	const getMessage = useCallback(e => {
		setMessage(e.target.value);
	}, []);

	const handleSubmit = useCallback(
		e => {
			e.preventDefault();

			if (message.trim().length === 0) return;

			const messageObj = {
				text: message,
				sender: user,
				date: new Date().toLocaleString(),
			};

			socket.emit("newMessage", { discussionId, messageObj });

			dispatch(addMessage(messageObj));
			setMessage("");
		},
		[dispatch, message, user, socket, discussionId],
	);

	return (
		<form className='messages-form' onSubmit={handleSubmit}>
			<input className='messages-form__input' type='text' placeholder='Type a message...' value={message} onChange={getMessage} />
			<button className='messages-form__button'>
				<span className='material-icons-outlined'>send</span>
			</button>
		</form>
	);
}
