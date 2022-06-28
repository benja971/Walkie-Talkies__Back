require("dotenv").config();
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const { getDB } = require("../mess");

async function login(req, res) {
	const { email, password } = req.body;

	console.log(email, password);

	// get a database connection
	const db = await getDB();

	// get the Users collection
	const collection = db.collection("Users");

	// find the user
	const user = await collection.findOne({
		email,
	});

	// check if the user exists
	if (!user) return res.status(204).json({ message: "User not found" });

	const contacts = user.contactIds.map(async contactId => {
		const contact = await collection.findOne({
			_id: new ObjectId(contactId),
		});

		delete contact.password;

		return contact;
	});

	user.contacts = await Promise.all(contacts);

	// check password
	if (await bcrypt.compare(password, user.password)) res.status(202).json(user);
	else res.status(400).send({ message: "Wrong email or password" });
}

async function register(req, res) {
	const { email, password } = req.body;

	// get a database connection
	const db = await getDB();

	// get the Users collection
	const collection = db.collection("Users");

	// hash the password
	const hashedPassword = bcrypt.hashSync(password, 10);

	// create the user
	const resu = await collection.insertOne({
		email,
		name: email.split("@")[0],
		avatar: null,
		contactIds: [],
		discussionsIds: [],
		password: hashedPassword,
	});

	const user = await collection.findOne({
		_id: resu.insertedId,
	});

	delete user.password;

	user.contacts = [];

	res.status(201).send(user);
}

module.exports = {
	login,
	register,
};
