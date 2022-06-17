import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../reducers/contactReducer";
import { toggleMessages, setDiscussionId, setMessages } from "../../../reducers/messagesReducer";

import "./Discussion.css";

export default function Discussion({ discusion }) {
	const [contact, setContact] = useState({});
	const [discusionName, setDiscusionName] = useState("");

	console.log({ discusion });

	const dispatch = useDispatch();

	const user = useSelector(state => state.user.user);

	const getContact = useCallback(async () => {
		const tmp = discusion.userIds.filter(userId => userId !== user._id);

		const res = await fetch(`http://localhost:8080/api/users/${tmp[0]}`);
		const data = await res.json();

		if (!data) return;

		setContact(data);
	}, [discusion, user]);

	const openDiscussion = useCallback(async () => {
		dispatch(setUser(contact));
		dispatch(toggleMessages());
		dispatch(setMessages(discusion.messages));
		dispatch(setDiscussionId(discusion._id));
	}, [contact, dispatch, discusion]);

	useEffect(() => {
		const name = discusion.names.find(name => name !== user.name);
		getContact();
		setDiscusionName(name);
	}, [discusion, getContact, user]);

	return (
		<div className='discussion' onClick={openDiscussion}>
			<img src={contact.avatar} alt='' />

			<div className='discussion-container'>
				<div className='discussion-div'>
					<div className='discussion-name'>{discusionName}</div>
				</div>
				<div className='discussion-message'>
					{
						// get last message
						discusion?.messages?.length > 0 ? discusion.messages[discusion.messages.length - 1].text : "coucou"
					}
				</div>
			</div>
		</div>
	);
}
