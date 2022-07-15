import { Button } from "@mui/material";
import React, { useContext, useRef } from "react";
import { SocketContext } from "../socket.io";

export function FileEditor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useContext(SocketContext);

  return (
    <>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/png, image/jpeg"
        onChange={({ target }) => {
          if (target.files) {
            socket.emit("UPLOAD", target.files[0]);
          }
        }}
      />
      <Button
        variant="contained"
        disableElevation
        size="medium"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.click();
          }
        }}
      >
        Upload
      </Button>
    </>
  );
}
