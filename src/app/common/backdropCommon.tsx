import { Backdrop } from "@mui/material";
import { CommonBackdropProps } from "../types";

export default function BackdropCommon(props: CommonBackdropProps) {
  const { open, sx, children } = props;
  return (
    <Backdrop
      open={open}
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.mobileStepper, // this is the only one lower than wallet modal
        ...sx,
      })}
    >
      {children}
    </Backdrop>
  );
}
