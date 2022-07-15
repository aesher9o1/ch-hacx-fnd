import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useRef, useContext, useState } from "react";
import { SocketContext } from "../socket.io";
import { Dialog } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import * as B64 from "base64-arraybuffer";

function base64ToArrayBuffer(base64: string) {
  return B64.decode(base64);
}

const convertBase64ToFile = (base64String: string, fileName = "aashis") => {
  let arr = base64String.split(",");

  let mime = arr[0].match(/:(.*?);/)?.[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let uint8Array = new Uint8Array(n);
  while (n--) {
    uint8Array[n] = bstr.charCodeAt(n);
  }
  let file = new File([uint8Array], fileName, { type: mime });
  return file;
};

export function Canvas() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const socket = useContext(SocketContext);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  return (
    <Box ml={2}>
      <Dialog
        open={isCanvasOpen}
        style={{ minWidth: "80vw", minHeight: "70vh" }}
      >
        <DialogTitle>
          <Typography>
            GoodNotes{" "}
            <IconButton
              aria-label="close"
              onClick={() => {
                canvasRef.current?.clearCanvas();
                setIsCanvasOpen(false);
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent style={{ minWidth: "100vw", minHeight: "70vh" }}>
          {isCanvasOpen && (
            <ReactSketchCanvas
              ref={canvasRef}
              backgroundImage="https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg"
              style={{ border: "none" }}
              width="31vw"
              height="80vh"
              strokeColor="black"
            ></ReactSketchCanvas>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              canvasRef.current?.exportImage("png").then((data) => {
                console.log(convertBase64ToFile(data));
                socket.emit("UPLOAD", convertBase64ToFile(data));
                canvasRef.current?.clearCanvas();
                setIsCanvasOpen(false);
              });
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        disableElevation
        size="medium"
        onClick={() => {
          setIsCanvasOpen(true);
        }}
      >
        Canvas
      </Button>
    </Box>
  );
}
