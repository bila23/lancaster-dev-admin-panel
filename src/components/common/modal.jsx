import React from "react";
import { Dialog } from "primereact/dialog";

const Modal = ({ children, flag, setFlag, header }) => {
  return (
    <Dialog
      visible={flag}
      onHide={() => setFlag(false)}
      closeOnEscape
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      header={header}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
