import { useEffect, useRef } from "react";
import Quill from "quill";
import { Box } from "@mui/system";
import { SIZES, COLORS } from "../Global";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import QuillCursors from "quill-cursors";

export function Editor() {
  const editorRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      Quill.register("modules/cursors", QuillCursors);

      window.addEventListener("load", () => {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
          "ws://localhost:3312",
          "velotio-demo",
          ydoc
        );
        const type = ydoc.getText("Velotio-Blog");

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

        const binding = new QuillBinding(type, editor, provider.awareness);
        provider.connect();
      });
    }, 0);
  }, []);

  return (
    <Box px={8}>
      <Box id="toolbar">
        <select className="ql-size">
          <option value="small"></option>
          <option selected></option>
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
  );
}
