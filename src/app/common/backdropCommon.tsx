import { Backdrop as BackdropMUI } from "@mui/material";
import { CommonBackdropProps } from "../types";

export default function BackdropCommon(props: CommonBackdropProps) {
  const { open, sx, children } = props;
  return (
    <BackdropMUI
      open={open}
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        ...sx,
      })}
    >
      {children}
    </BackdropMUI>
  );
}
