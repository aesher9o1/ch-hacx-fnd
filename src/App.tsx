import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import "./App.css";
import { Editor } from "./editor/Editor";
import { NavBar } from "./Navbar";
import { socket, SocketContext } from "./socket.io";

const Container = styled(Grid)({
  paddingTop: "1.5em",
});

function App() {
  return (
    <Box display="flex" flexDirection="column" height="98.7vh">
      <NavBar />

      <Grid container style={{ height: "100%" }}>
        <SocketContext.Provider value={socket}>
          <Container item xs={12}>
            <Editor />
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
