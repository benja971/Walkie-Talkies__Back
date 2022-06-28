const { ObjectId } = require("mongodb");
const { getDB } = require("../mess");

async function addMessage(id, newMsg) {
	const db = await getDB();
	const _id = new ObjectId(id);

	const Discussions = db.collection("Discussions");

	const discussion = await Discussions.findOne({ _id });

	if (!discussion) return 0;

	await Discussions.updateOne({ _id }, { $push: { messages: newMsg } });

	return newMsg;
}

module.exports = {
	addMessage,
};
