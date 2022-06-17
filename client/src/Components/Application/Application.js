import { useSelector } from "react-redux";

import ContactList from "../ContactList/ContactList";
import MessageList from "../MessageList/MessageList";
import MessageFom from "../MessageList/MessageForm/MessageForm";

import "./Application.css";

export default function Application() {
	const { showMessages } = useSelector(state => state.messages);

	return (
		<div className='application'>
			<ContactList />
			<div className='right'>
				{showMessages && (
					<>
						<MessageList />
						<MessageFom />
					</>
				)}
			</div>
		</div>
	);
}
