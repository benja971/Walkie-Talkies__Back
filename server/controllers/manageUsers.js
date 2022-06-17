const { getDB } = require("../mess");
const { ObjectId } = require("mongodb");

async function getContactList(userId) {
	const db = await getDB();

	const collection = db.collection("Users");
	const user = await collection.findOne({ _id: new ObjectId(userId) });

	if (!user) return;

	const contacts = user.contactIds.map(contactId => {
		const contact = collection.findOne({ _id: new ObjectId(contactId) });
		delete contact.password;
		return contact;
	});

	return await Promise.all(contacts);
}

async function getAllUsers(req, res) {
	const db = await getDB();

	const collection = db.collection("Users");

	let users = await collection.find().toArray();

	users = users.map(user => {
		delete user.password;
		return user;
	});

	res.status(200).send(users);
}

async function getUser(req, res) {
	const db = await getDB();

	const collection = db.collection("Users");

	const user = await collection.findOne({
		_id: new ObjectId(req.params.id),
	});

	if (!user) return res.status(404).send("User not found");

	delete user.password;

	res.status(200).send(user);
}

async function deleteUser(req, res) {
	const db = await getDB();

	const collection = db.collection("Users");

	const resu = await collection.deleteOne({
		_id: new ObjectId(req.params.id),
	});

	if (resu.deletedCount === 0) return res.status(404).send("User not found");

	res.status(200).send(resu);
}

async function addContact(req, res) {
	const { id, newC } = req.params;

	const db = await getDB();

	const Users = db.collection("Users");
	const Discussions = db.collection("Discussions");

	// get user
	const user = await Users.findOne({ _id: new ObjectId(id) });

	if (!user) return res.status(404).send("User not found");

	// get contact
	const contact = await Users.findOne({ _id: new ObjectId(newC) });

	if (!contact) return res.status(404).send("Contact not found");

	// add contact to user
	user.contactIds.push(newC);

	// edit db
	await Users.updateOne({ _id: new ObjectId(id) }, { $set: { contactIds: user.contactIds } });

	// create discussion
	const discussion = {
		userIds: [id, newC],
		messages: [],
	};
	const resu = await Discussions.insertOne(discussion);

	// add discussion to user and contact
	user.discussionsIds.push(resu.insertedId);
	contact.discussionsIds.push(resu.insertedId);

	// edit db
	await Users.updateOne({ _id: new ObjectId(id) }, { $set: { discussionsIds: user.discussionsIds } });

	await Users.updateOne({ _id: new ObjectId(newC) }, { $set: { discussionsIds: contact.discussionsIds } });

	res.status(200).send({ user, discu: resu.insertedId });
}

async function getContacts(req, res) {
	const contacts = await getContactList(req.params.id);

	if (!contacts) return res.status(404).send("User not found");

	res.status(200).send(contacts);
}

async function deleteUsers(req, res) {
	const db = await getDB();

	const collection = db.collection("Users");

	// delete all users
	const resu = await collection.deleteMany({});

	res.status(200).send(resu);
}

async function getDiscussions(req, res) {
	const { userId } = req.params;

	const db = await getDB();

	const Users = db.collection("Users");

	const user = await Users.findOne({ _id: new ObjectId(userId) });

	if (!user) return res.status(404).send("User not found");

	const Discussions = db.collection("Discussions");

	const discussions = user.discussionsIds.map(async discussionId => {
		const discussion = await Discussions.findOne({ _id: new ObjectId(discussionId) });
		const names = discussion.userIds.map(async userId => {
			const user = await Users.findOne({ _id: new ObjectId(userId) });
			return user.name;
		});

		discussion.names = await Promise.all(names);

		return discussion;
	});

	const discussionsList = await Promise.all(discussions);

	res.status(200).send(discussionsList);
}

module.exports = {
	getAllUsers,
	getUser,
	deleteUser,
	addContact,
	getContacts,
	deleteUsers,
	getDiscussions,
	getContactList,
};
