import React, { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useContext } from "react";

const PeerContext = React.createContext(null);

export const usePeerContext = () => {
	return useContext(PeerContext);
};

export const PeerContexProvider = ({ children }) => {
	const [remoteStream, setRemoteStream] = useState(null);

	const peer = useMemo(
		() =>
			new RTCPeerConnection({
				iceServers: [
					{
						urls: [
							"stun:stun.l.google.com:19302",
							"stun:global.stun.twilio.com:3478",
						],
					},
				],
			}),
		[]
	);

	const createOffer = async () => {
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);
		return offer;
	};

	const createAnswer = async (offer) => {
		await peer.setRemoteDescription(offer);
		const answer = peer.createAnswer();
		await peer.setLocalDescription(answer);
		return answer;
	};

	const setRemoteAnswer = async (ans) => {
		await peer.setRemoteDescription(ans);
	};

	const sendStream = async (stream) => {
		const tracks = await stream.getTracks();
		for (const track of tracks) {
			peer.addTrack(track, stream);
		}
	};

	const handleTrackEvent = useCallback(
		(ev) => {
			const streams = ev.streams;
			console.log(streams);
			setRemoteStream(streams[0]);
		},
		[setRemoteStream]
	);

	useEffect(() => {
		peer.addEventListener("track", handleTrackEvent);
		return () => {
			peer.removeEventListener("track", handleTrackEvent);
		};
	}, [peer, handleTrackEvent]);

	return (
		<PeerContext.Provider
			value={{
				peer,
				createOffer,
				createAnswer,
				setRemoteAnswer,
				sendStream,
				remoteStream,
			}}>
			{children}
		</PeerContext.Provider>
	);
};
