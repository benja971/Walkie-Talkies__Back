const express = require("express");
const path = require("path");

const { login, register } = require("./controllers/access");
const { getAllUsers, getUser, deleteUser, addContact, getContacts, deleteUsers, getDiscussions } = require("./controllers/manageUsers");
const { addMessage } = require("./controllers/manageDiscussions.js");

/**
 *
 * @param {Express} app
 * @param {server} io
 */
module.exports = function (app, io) {
	app.use(express.static(path.join(__dirname, "../client/build")));

	io.on("connection", socket => {
		console.log("a user connected");

		socket.on("newMessage", async data => {
			const { discussionId, messageObj } = data;
			console.log(data);

			const msg = await addMessage(discussionId, messageObj);
			console.log(msg);

			if (!msg) return;

			socket.broadcast.emit("newMessage", data);
			// socket.emit("newMessage", newMessage);
		});

		socket.on("disconnect", () => {
			console.log("user disconnected");
		});
	});

	app.post("/api/login", login);

	app.post("/api/register", register);

	app.get("/api/users", getAllUsers);

	app.get("/api/users/:id", getUser);

	app.delete("/api/users/:id", deleteUser);

	app.get("/api/users/:id/contacts", getContacts);

	app.get("/api/discussions/:userId", getDiscussions);

	// update user data
	app.post("/api/users/:id", (req, res) => {
		res.send({});
	});

	app.put("/api/users/:id/contacts/:newC", addContact);

	app.get("/api/users/delete", deleteUsers);
};
