import { useEffect, useRef } from "react";
import Quill from "quill";
import { Box } from "@mui/system";
import { SIZES, COLORS } from "../Global";

export function Editor() {
  const editorRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      new Quill(editorRef.current as any, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
      });
    }, 0);
  }, []);

  return (
    <>
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
      <div ref={editorRef} />
    </>
  );
}
