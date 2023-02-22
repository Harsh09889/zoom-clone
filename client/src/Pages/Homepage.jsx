import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const Homepage = () => {
	const [state, setState] = useState({ emailId: "", roomId: "" });
	const { socket } = useSocket();
	const navigate = useNavigate();

	const handleRoomJoined = useCallback(
		({ roomId }) => {
			navigate(`/room/${roomId}`);
		},
		[navigate]
	);

	useEffect(() => {
		socket.on("room-joined", handleRoomJoined);
		return () => {
			socket.off("room-joined", handleRoomJoined);
		};
	}, [socket, handleRoomJoined]);

	function handleJoinRoom(e) {
		e.preventDefault();
		if (!state.emailId || !state.roomId) return alert("enter both the fields");
		console.log("handle join room");

		socket.emit("join-room", state);
	}

	return (
		<div>
			<form
				onSubmit={handleJoinRoom}
				style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
				<input
					type='email'
					value={state.emailId}
					placeholder='Enter Email Id'
					onChange={(e) => setState((p) => ({ ...p, emailId: e.target.value }))}
				/>
				<input
					type='text'
					placeholder='Enter Room Id'
					value={state.roomId}
					onChange={(e) => setState((p) => ({ ...p, roomId: e.target.value }))}
				/>
				<button>Enter Room</button>
			</form>
		</div>
	);
};

export default Homepage;
