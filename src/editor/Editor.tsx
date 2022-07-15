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
import {
  sendCheckpoint,
  sendUpdates,
  SocketContext,
  UpdatePacket,
} from "../socket.io";
import { SyncModal } from "./SyncModal";
import { EVENTS, getRandomUserColor, isMobile } from "./events";
import _ from "lodash";

export function Editor({
  ydoc,
  awareness,
}: {
  ydoc: Y.Doc;
  awareness: Awareness;
}) {
  const SYNC_INTERVAL_MS = 2000;

  const editorRef = useRef(null);
  const socket = useContext(SocketContext);

  const setsyncDebounced = useRef(
    _.debounce(() => {
      console.log("sending checkpoint...");
      sendCheckpoint(Y.encodeStateAsUpdateV2(ydoc));
    }, SYNC_INTERVAL_MS)
  );

  useEffect(() => {
    console.log("SOCKET ID:", socket.id, " YJS ID", ydoc.guid);
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

    awareness.setLocalStateField("user", {
      name: awareness.clientID,
      color: getRandomUserColor(),
    });

    new QuillBinding(type, editor, awareness);

    socket.on(
      EVENTS.RECEIVE,
      ({ actions, awarenessUpdate, origin }: UpdatePacket) => {
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

    socket.on("PROCESSED", (data) => {
      console.log("processed");
      editor.focus();
      editor.insertText(0, data);
    });

    awareness.on("update", () => {
      const connectedClients = Array.from(awareness.getStates().keys());

      sendUpdates(
        undefined,
        encodeAwarenessUpdate(awareness, connectedClients)
      );
    });

    ydoc.on("update", (update: Uint8Array) => {
      sendUpdates(update);
      setsyncDebounced.current();
    });
  }, [socket]);

  return (
    <>
      <SyncModal doc={ydoc} awareness={awareness} />
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
