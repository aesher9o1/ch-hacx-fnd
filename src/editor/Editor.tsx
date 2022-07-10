import { useContext, useEffect, useRef } from "react";
import Quill from "quill";
import { Box } from "@mui/system";
import { SIZES, COLORS } from "../Global";
import * as Y from "yjs";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";
import { SocketContext } from "../socket.io";
import { SyncModal } from "./SyncModal";
import { ROOM, EVENTS, getRandomUserColor, isMobile } from "./events";
import _ from "lodash";

export function Editor() {
  const SYNC_INTERVAL_MS = 2000;

  const editorRef = useRef(null);
  const socket = useContext(SocketContext);

  const setsyncDebounced = useRef(
    _.debounce(() => {
      console.log("sending checkpoint...");
      socket.emit(EVENTS.CHECKPOINT, {
        actions: Y.encodeStateAsUpdateV2(ydoc),
        roomName: ROOM,
      });
    }, SYNC_INTERVAL_MS)
  );

  const ydoc = new Y.Doc();

  useEffect(() => {
    setTimeout(() => {
      Quill.register("modules/cursors", QuillCursors);

      // Define a shared text type on the document
      const type = ydoc.getText("quill");

      const editor = new Quill(editorRef.current as any, {
        theme: "snow",
        modules: {
          cursors: true,
          toolbar: "#toolbar",
          history: {
            userOnly: true,
          },
        },
      });

      const awareness = new Awareness(ydoc);

      awareness.setLocalStateField("user", {
        name: awareness.clientID,
        color: getRandomUserColor(),
      });

      const clientId = document.getElementById("client");

      if (clientId) clientId.innerHTML = awareness.clientID + "";

      new QuillBinding(type, editor, awareness);

      // correctAwareness(awareness);

      //socket.io events
      socket.on(
        EVENTS.RECEIVE,
        ({
          actions,
          awarenessUpdate,
          origin,
        }: {
          actions: any;
          roomName: string;
          awarenessUpdate: any;
          origin: number;
        }) => {
          if (awarenessUpdate) {
            applyAwarenessUpdate(
              awareness,
              new Uint8Array(awarenessUpdate),
              origin
            );
          }
          if (actions) Y.applyUpdate(ydoc, new Uint8Array(actions));
        }
      );

      awareness.on("update", (awUpdate: any) => {
        console.log(Array.from(awareness.getStates().keys()));
        const conenctedClients = Array.from(awareness.getStates().keys());
        // console.log(conenctedClients);
        socket.emit(EVENTS.SEND, {
          actions: null,
          roomName: ROOM,
          origin: socket.id,
          awarenessUpdate: encodeAwarenessUpdate(awareness, conenctedClients),
        });
      });

      ydoc.on("update", (update: Uint8Array) => {
        socket.emit(EVENTS.SEND, {
          actions: update,
          roomName: ROOM,
          origin: socket.id,
          awarenessUpdate: null,
        });

        setsyncDebounced.current();
      });
    }, 0);
  }, []);

  return (
    <>
      <SyncModal doc={ydoc} />
      <Box px={isMobile() ? 0 : 8}>
        <Box id="toolbar">
          <select className="ql-size" defaultValue={"normal"}>
            <option value="small"></option>
            <option value="normal"></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>

          <Box
            px={"130px"}
            sx={{
              borderRight: 1,
              borderWidth: SIZES.border,
              borderColor: COLORS.border,
            }}
          >
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
          </Box>
          <Box px={"250px"}>
            <button className="ql-link" />
            <button className="ql-align" />
          </Box>
        </Box>
        <Box ref={editorRef} pt={1} />
      </Box>
    </>
  );
}
