import { useContext, useEffect, useState } from "react";
import { Typography, Fade, Modal, Box, Backdrop } from "@mui/material";
import { sendUpdates, SocketContext } from "../socket.io";
import { ROOM, EVENTS } from "./events";
import * as Y from "yjs";
import { Awareness, encodeAwarenessUpdate } from "y-protocols/awareness";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 25,
  p: 4,
};

export function SyncModal({
  doc,
  awareness,
}: {
  doc: Y.Doc;
  awareness: Awareness;
}) {
  const [open, setOpen] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(EVENTS.SYNC, ({ sync, data }: { sync: boolean; data?: any }) => {
      console.log("syncing to server..."); //should receive array buffer
      if (sync) {
        setOpen(false);
        if (data) {
          Y.applyUpdateV2(doc, new Uint8Array(data));
        }
        const connectedClients = Array.from(awareness.getStates().keys());
        sendUpdates(
          undefined,
          encodeAwarenessUpdate(awareness, connectedClients)
        );
      }
    });
  }, []);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Please wait while syncing
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            Here we get the state from redis and wait for reconsilation across
            clients.
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
