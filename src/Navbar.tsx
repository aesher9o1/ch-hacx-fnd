import styled from "@emotion/styled";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Canvas } from "./buttons/Canvas";
import { FileEditor } from "./buttons/FileEditor";
import { COLORS, SIZES } from "./Global";

const Logo = styled.img({
  width: "40px",
  display: "block",
  paddingRight: "1em",
});

const BarPadding = styled(Toolbar)({
  paddingBottom: 0,
});

export function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: 1,
          borderWidth: SIZES.border,
          borderColor: COLORS.border,
        }}
      >
        <BarPadding style={{ paddingBottom: 0 }}>
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            style={{ minHeight: "54px" }}
          >
            <Box
              width="70px"
              height="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              style={{ minHeight: "54px" }}
            >
              <Logo src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/hohs8swq3kxoldxg0crz" />
            </Box>

            <Box
              display="flex"
              flex="1"
              flexDirection="row"
              justifyContent="space-between"
              sx={{
                borderLeft: 1,
                borderWidth: SIZES.border,
                borderColor: COLORS.border,
                paddingLeft: "1.5em",
              }}
            >
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography
                  variant="h6"
                  fontWeight="500"
                  style={{ verticalAlign: "center" }}
                >
                  Quillbook.
                </Typography>
              </Box>

              <Box display="flex" justifyContent="center" alignItems="center">
                <FileEditor />

                <Canvas />
              </Box>
            </Box>
          </Box>
        </BarPadding>
      </AppBar>
    </Box>
  );
}
