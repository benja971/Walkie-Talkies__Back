import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Discussion from "./Discussion/Discussion";
import Contact from "./Contact/Contact";
import { uniqueId, deleteCookie } from "../../mess";

import "./ContactList.scss";

export default function ContactList() {
	const [discussionList, setDiscussionList] = useState([]);
	const [showContactList, setShowContactList] = useState(true);
	const [showProfileParams, setShowProfileParams] = useState(false);
	const [hasDiscussions, setHasDiscussions] = useState(false);
	const [search, setSearch] = useState("");
	const [title, setTitle] = useState("No conversations");

	const profileRef = useRef(null);

	const user = useSelector(state => state.user.user);
	const getDiscussionList = useCallback(async () => {
		const res = await fetch(`http://localhost:8080/api/discussions/${user._id}`);
		const data = await res.json();

		if (!data) return;

		const discussions = data.map(async discussion => {
			const nameList = discussion.userIds.map(async userId => {
				const res = await fetch(`http://localhost:8080/api/users/${userId}`);
				const data = await res.json();

				return data.name;
			});

			const names = await Promise.all(nameList);

			return {
				...discussion,
				names,
			};
		});

		setTitle("Your conversations");
		setHasDiscussions(true);
		setDiscussionList(await Promise.all(discussions));
	}, [user]);

	const handleSearch = useCallback(
		async e => {
			setSearch(e.target.value);
			setHasDiscussions(false);

			// get all users
			let res = await fetch(`http://localhost:8080/api/users`);
			const data = await res.json();

			if (!data) return;

			// list of all users who are not in the current user's contact list and who match the search

			const allUsers = data.filter(usr => {
				const isNotme = usr._id !== user._id;
				const isSearch = usr.name.toLowerCase().includes(e.target.value.toLowerCase());

				return isNotme && isSearch;
			});

			// list of all users who are in the current user's contact list and who match the search

			res = await fetch(`http://localhost:8080/api/discussions/${user._id}`);
			let myDiscussions = await res.json();

			if (myDiscussions)
				myDiscussions = myDiscussions.filter(dis => {
					const name = dis.names.filter(n => {
						return n.toLowerCase() !== user.name.toLowerCase();
					})[0];

					return name.toLowerCase().includes(e.target.value.toLowerCase());
				});

			setHasDiscussions(myDiscussions.length > 0);
			setDiscussionList(e.target.value.length === 0 ? [] : hasDiscussions ? myDiscussions : allUsers);

			setTitle(e.target.value.length === 0 ? "No conversations" : hasDiscussions ? `${myDiscussions.length} conversations` : `${allUsers.length} users`);
		},
		[user, hasDiscussions],
	);

	useLayoutEffect(() => {
		getDiscussionList();
	}, [getDiscussionList, setTitle]);

	return (
		<div className='contact-list'>
			<header>
				<div className='user-div'>
					<img
						src={user && user.avatar}
						alt=''
						ref={profileRef}
						className='profile'
						onClick={() => {
							setShowContactList(!showContactList);
							setShowProfileParams(!showProfileParams);
						}}
					></img>
					<h3>{user && user.name}</h3>
				</div>

				<div className='icons'>
					<span className='icon material-icons' onClick={e => {}}>
						more_horiz
					</span>
					<span
						className='icon material-icons'
						onClick={e => {
							deleteCookie("user");
							window.location.href = "/";
						}}
					>
						logout
					</span>
				</div>
			</header>
			{showContactList && (
				<section>
					<div className='search-bar-container'>
						<input className='search-input' type='search' placeholder='Search' value={search} onChange={handleSearch} />
					</div>

					<main>
						<p className='contact-list__title'>{title}</p>
						{discussionList.map(discusion => {
							if (hasDiscussions) return <Discussion key={uniqueId()} discusion={discusion} />;
							else if (!hasDiscussions && discussionList.length) return <Contact key={uniqueId()} contact={discusion} setSearch={setSearch} setTitle={setTitle} />;

							return null;
						})}
					</main>
				</section>
			)}
			{showProfileParams && (
				<section>
					<h1>Params</h1>
				</section>
			)}
		</div>
	);
}
