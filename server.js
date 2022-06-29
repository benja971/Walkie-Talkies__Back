const express = require("express");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const routes = require("./routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		// credentials: true,
	},
});

// middlewares
app.enable("trust proxy");

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

routes(app, io);

const port = parseInt(process.env.PORT) || 8080;
server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
