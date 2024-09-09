import { PayPopupProps } from "@/app/types";
import { Backdrop } from "@mui/material";
import { useEffect, useRef } from "react";

export default function PayPopup(props: PayPopupProps) {
  const { popupPay, onClosePopupPay } = props;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClosePopupPay();
      }
    };
    if (popupPay) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupPay, onClosePopupPay]);
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={popupPay}
    >
      <div ref={menuRef} className="bg-black">
        hello
      </div>
    </Backdrop>
  );
}
