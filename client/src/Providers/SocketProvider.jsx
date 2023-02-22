import React, { useContext } from "react";
import { useMemo } from "react";
import { io } from "socket.io-client";

export const SocketContext = React.createContext();

export function useSocket() {
	return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
	const socket = useMemo(() => io("http://localhost:8001"), []);
	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
}
