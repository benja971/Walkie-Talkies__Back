import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import socketIOClient from "socket.io-client";

import { addMessage } from "../../reducers/messagesReducer";
import { uniqueId } from "../../mess";

import Message from "./Message/Message";

import "./MessageList.scss";

const ENDPOINT = "http://127.0.0.1:8080";

export default function MessageList() {
	const { messages, discussionId } = useSelector(state => state.messages);

	const socket = useMemo(() => socketIOClient(ENDPOINT), []);

	const dispatch = useDispatch();

	useEffect(() => {
		socket.on("newMessage", data => {
			const { messageObj } = data;

			if (discussionId !== data.discussionId) return;

			console.log("Message received:", messageObj);

			dispatch(addMessage(messageObj));
		});
	}, [dispatch, socket, discussionId]);

	return (
		<div className='message-list'>
			{messages.map(message => (
				<Message key={uniqueId()} message={message} />
			))}
		</div>
	);
}
