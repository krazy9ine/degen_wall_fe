import { Backdrop as BackdropMUI } from "@mui/material";
import { CommonBackdropProps } from "../types";

export default function BackdropCommon(props: CommonBackdropProps) {
  const { open, sx, children } = props;
  return (
    <BackdropMUI
      open={open}
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.mobileStepper, // this is the only one lower than wallet modal
        ...sx,
      })}
    >
      {children}
    </BackdropMUI>
  );
}
