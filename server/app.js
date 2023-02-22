const { Server } = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");

// Initialisation
const app = express();
const io = new Server({ cors: true });

//MiddleWares
app.use(bodyParser.json());

//Listening

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
	console.log("New Connection");

	socket.on("join-room", (data) => {
		const { roomId, emailId } = data;
		emailToSocketMapping.set(emailId, socket.id);
		socketToEmailMapping.set(socket.id, emailId);
		console.log("User", emailId, "joined Room", roomId);

		socket.join(roomId);
		socket.emit("room-joined", { roomId });
		socket.broadcast.to(roomId).emit("user-joined", { emailId });
	});

	socket.on("call-user", ({ emailId, offer }) => {
		const socketId = emailToSocketMapping.get(emailId);
		const emailFrm = socketToEmailMapping.get(socket.id);

		socket.to(socketId).emit("incoming-call", { from: emailFrm, offer });
	});

	socket.on("call-accepted", ({ emailId, ans }) => {
		const socketId = emailToSocketMapping.get(emailId);
		socket.to(socketId).emit("call-accepted", { ans });
	});
});

//Starting
app.listen(8000, () => console.log("Express is running at the port 8000"));
io.listen(8001);
