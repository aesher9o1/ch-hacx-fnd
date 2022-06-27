import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import "./App.css";
import { Chat } from "./chat/Chat";
import { Editor } from "./editor/Editor";
import { SIZES, COLORS } from "./Global";
import { NavBar } from "./Navbar";

const Container = styled(Grid)({
  padding: "1.5em 2em",
});

function App() {
  return (
    <Box display="flex" flexDirection="column" height="98.7vh">
      <NavBar />

      <Grid container style={{ height: "100%" }}>
        <Container item xs={9}>
          <Editor />
        </Container>
        <Container
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
        </Container>
      </Grid>
    </Box>
  );
}

export default App;
