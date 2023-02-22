import { useState } from "react";
import { useCallback, useEffect } from "react";
import { usePeerContext } from "../Providers/Peer";
import { useSocket } from "../Providers/SocketProvider";
import ReactPlayer from "react-player";

const Room = () => {
	const { socket } = useSocket();
	const {
		peer,
		createOffer,
		createAnswer,
		setRemoteAnswer,
		sendStream,
		remoteStream,
	} = usePeerContext();
	const [myStream, setMyStream] = useState(null);
	const [remoteEmailId, setRemoteEmailId] = useState("");

	const handleNewUserJoined = useCallback(
		async ({ emailId }) => {
			const offer = await createOffer();
			socket.emit("call-user", { emailId, offer });
			console.log("user called with", emailId, offer);
			setRemoteEmailId(emailId);
		},
		[createOffer, socket]
	);

	const handleIncomingCall = useCallback(
		async ({ from, offer }) => {
			console.log("Incoming call from", from, offer);
			const ans = await createAnswer(offer);
			socket.emit("call-accepted", { emailId: from, ans });
			setRemoteEmailId(from);
		},
		[createAnswer, socket]
	);

	const handleCallAccepted = useCallback(
		async ({ ans }) => {
			await setRemoteAnswer(ans);
			console.log("Call got Accepted", ans);
		},
		[setRemoteAnswer]
	);

	const getUserMediaStream = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});

		setMyStream(stream);
	}, [sendStream]);

	useEffect(() => {
		socket.on("user-joined", handleNewUserJoined);
		socket.on("incoming-call", handleIncomingCall);
		socket.on("call-accepted", handleCallAccepted);

		return () => {
			socket.off("user-joined", handleNewUserJoined);
			socket.off("incoming-call", handleIncomingCall);
			socket.off("call-accepted", handleCallAccepted);
		};
	}, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

	const handleNegotiation = useCallback(async () => {
		const localOffer = await peer.localDescription;
		socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
	}, [peer.localDescription, socket, remoteEmailId]);

	useEffect(() => {
		peer.addEventListener("negotiationneeded", handleNegotiation);

		return () => {
			peer.removeEventListener("negotiationneeded", handleNegotiation);
		};
	}, [peer]);

	useEffect(() => {
		getUserMediaStream();
	}, [getUserMediaStream]);

	return (
		<div>
			<h1>This is a room</h1>
			<h4>You are connected to {remoteEmailId}</h4>
			<button onClick={(e) => sendStream(myStream)}>Click to send Video</button>
			<ReactPlayer
				url={myStream}
				playing={true}
				muted
			/>
			<ReactPlayer
				url={remoteStream}
				playing={true}
				muted
			/>
		</div>
	);
};

export default Room;
