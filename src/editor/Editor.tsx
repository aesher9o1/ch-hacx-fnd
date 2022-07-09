import { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { Box } from "@mui/system";
import { SIZES, COLORS } from "../Global";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";
import { SocketContext } from "../socket.io";
import { SyncModal } from "./SyncModal";
import { ROOM, EVENTS } from "./events";
import _ from "lodash";

export function Editor() {
  const SYNC_INTERVAL_MS = 2000;

  const editorRef = useRef(null);
  const socket = useContext(SocketContext);
  const [isSyncedWithServer, syncWithServer] = useState(false);
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
      new QuillBinding(type, editor, awareness);

      //socket.io events
      socket.on(
        EVENTS.RECEIVE,
        ({ actions, roomname }: { actions: any; roomname: string }) => {
          Y.applyUpdate(ydoc, new Uint8Array(actions));
        }
      );

      ydoc.on("update", (update: Uint8Array, origin, doc) => {
        // const encoder = createEncoder();
        // writeVarUint(encoder, STATE.SENT);
        // writeUpdate(encoder, update);
        // console.log(toUint8Array(encoder));
        // socket.emit(EVENTS.SEND, {
        //   actions: toUint8Array(encoder),
        //   roomName: ROOM,
        // });

        socket.emit(EVENTS.SEND, {
          actions: update,
          roomName: ROOM,
        });

        setsyncDebounced.current();
      });
    }, 0);
  }, []);

  return (
    <>
      <SyncModal doc={ydoc} />
      <Box px={8}>
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
