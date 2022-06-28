const { MongoClient } = require("mongodb");

async function getDB() {
	const uri = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_HOST}`;

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	await client.connect();

	const db = client.db(process.env.DB_NAME);

	return db;
}

module.exports = {
	getDB,
};
