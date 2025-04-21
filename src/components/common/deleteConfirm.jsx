import React from "react";
import Modal from "./modal";

const DeleteConfirm = ({ deleteDlg, setDeleteDlg, label, deleteById }) => {
  return (
    <Modal flag={deleteDlg} setFlag={setDeleteDlg} header="Eliminar Registro">
      <div className="row" style={{ marginTop: "15px" }}>
        <div className="col s12" style={{ fontSize: "18px" }}>
          ¿{label ? label : "Esta seguro que desea eliminar el registro"}?
        </div>
      </div>
      <div className="row">
        <div className="col s12 right-align">
          <button
            className="btn waves-effect waves-light grey darken-1"
            onClick={() => setDeleteDlg(false)}
          >
            <i className="material-icons left">clear</i>
            No
          </button>
          <button
            className="btn waves-effect waves-light cyan darken-2"
            style={{ marginLeft: "15px" }}
            onClick={deleteById}
          >
            <i className="material-icons left">check</i>
            Si
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
