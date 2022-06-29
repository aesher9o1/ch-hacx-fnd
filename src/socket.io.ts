import { createContext } from "react";
import io from "socket.io-client";

export const socket = io("ws://localhost:3000/article");
export const SocketContext = createContext(socket);
