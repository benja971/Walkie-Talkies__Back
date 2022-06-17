import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../reducers/contactReducer";
import { toggleMessages, setDiscussionId, setMessages } from "../../../reducers/messagesReducer";
import "./Contact.css";

export default function Contact({ contact, setSearch, setTitle }) {
	const user_ = useSelector(state => state.user.user);
	console.log({ contact });
	const dispatch = useDispatch();

	const addContact = useCallback(async () => {
		setSearch("");
		setTitle("Your conversations");

		const res = await fetch(`http://localhost:8080/api/users/${user_._id}/contacts/${contact._id}`, {
			method: "PUT",
		});

		if (!res || !res.ok) return;

		const data = await res.json();

		if (!data) return;

		return data;
	}, [contact, user_, setSearch, setTitle]);

	const handleClick = useCallback(async () => {
		const datas = await addContact();

		if (!datas) return;

		const { user, discu } = datas;

		dispatch(setUser(user));
		dispatch(toggleMessages());
		dispatch(setMessages([]));
		dispatch(setDiscussionId(discu));
	}, [dispatch, addContact]);

	return (
		<div className='contact' onClick={handleClick}>
			<img src={contact.avatar} alt='' />
			<div className='contact-name'>{contact.name}</div>
		</div>
	);
}
