import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import "./App.css";
import { Editor } from "./editor/Editor";
import { NavBar } from "./Navbar";
import { socket, SocketContext } from "./socket.io";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";

const Container = styled(Grid)({
  paddingTop: "1.5em",
});

function App() {
  const yDoc = new Y.Doc();

  return (
    <Box display="flex" flexDirection="column" height="98.7vh">
      <NavBar />

      <Grid container style={{ height: "100%" }}>
        <SocketContext.Provider value={socket}>
          <Container item xs={12}>
            <Editor ydoc={yDoc} awareness={new Awareness(yDoc)} />
          </Container>
          {/* <Container
            item
            xs={3}
            sx={{
              borderLeft: 1,
              borderWidth: SIZES.border,
              borderColor: COLORS.border,
              paddingLeft: "1.5em",
            }}
          >
            <Chat />
          </Container> */}
        </SocketContext.Provider>
      </Grid>
    </Box>
  );
}

export default App;
