import { createContext } from "react";
import io from "socket.io-client";
import { EVENTS, ROOM } from "./editor/events";

export const socket = io("ws://192.168.1.33:3000/article");
export const SocketContext = createContext(socket);

// export const EVENTS = {
//   RECEIVE: "RECEIVE", //get updates from server
//   SEND: "SEND", //send update to the server
//   SYNC: "SYNC", //sync with server
//   CHECKPOINT: "CHECKPOINT", //checkpoint data from server
// };

export const sendUpdates = () => {};

export const sendCheckpoint = (updates: ArrayBuffer) => {
  socket.emit(EVENTS.CHECKPOINT, {
    actions: updates,
    roomName: ROOM,
  });
};
