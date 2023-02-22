import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Room from "./Pages/Room";
import SocketProvider from "./Providers/SocketProvider";
import { PeerContexProvider } from "./Providers/Peer";

function App() {
	return (
		<div className='App'>
			<SocketProvider>
				<PeerContexProvider>
					<Routes>
						<Route
							path='/'
							element={<Homepage />}
						/>
						<Route
							path='/room/:id'
							element={<Room />}
						/>
					</Routes>
				</PeerContexProvider>
			</SocketProvider>
		</div>
	);
}

export default App;
