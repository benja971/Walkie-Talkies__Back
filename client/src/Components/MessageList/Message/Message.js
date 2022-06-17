import { useSelector } from "react-redux";

import "./Message.css";

export default function Message({ message }) {
	const contact = useSelector(state => state.contact.user);

	const isOwnMessage = message.sender._id === contact._id;

	return (
		<div className={`message ${isOwnMessage ? "left" : "right"}`}>
			<div className='message-text'>{message.text}</div>
			<div className='message-date'>{message.date.slice(11, 17)}</div>
		</div>
	);
}
