import { Backdrop } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null); // Step 1: Create a ref for the menu content

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Step 3: useEffect to add and remove event listeners for handling outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { //@ts-ignore
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div>
      <button onClick={handleOpen}>Settings</button>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <div ref={menuRef}>
          {" "}
          {/* Step 1: Attach the ref to the menu content */}
          hello
        </div>
      </Backdrop>
    </div>
  );
}
