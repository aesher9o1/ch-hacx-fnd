import { createContext } from "react";
import io from "socket.io-client";
import { EVENTS, ROOM } from "./editor/events";

export const socket = io("ws://192.168.1.33:3000/article");
export const SocketContext = createContext(socket);

export interface UpdatePacket {
  actions?: ArrayBuffer;
  roomName: string;
  origin: string;
  awarenessUpdate?: ArrayBuffer;
}

export const sendUpdates = (updates?: ArrayBuffer, awareness?: ArrayBuffer) => {
  socket.emit(EVENTS.SEND, {
    actions: updates,
    roomName: ROOM,
    origin: socket.id,
    awarenessUpdate: awareness,
  } as UpdatePacket);
};

export const sendCheckpoint = (updates: ArrayBuffer) => {
  socket.emit(EVENTS.CHECKPOINT, {
    actions: updates,
    roomName: ROOM,
  });
};
