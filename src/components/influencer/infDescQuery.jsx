import React, { useState, useEffect, useRef } from "react";
import service from "../../service/modules/infDescService";
import InfDescSave from "./infDescSave";
import InfDescTable from "./infDescTable";
import Btn from "../common/btn";
import util from "../../service/common/util";
import Modal from "../common/modal";
import DeleteConfirm from "../common/deleteConfirm";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const InfDescQuery = () => {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [editDlg, setEditDlg] = useState(false);
  const [deleteDlg, setDeleteDlg] = useState(false);
  const [saveDlg, setSaveDlg] = useState(false);
  const [model, setModel] = useState("");

  const find = async () => {
    try {
      const result = await service.findAll();
      setData(result);
    } catch (e) {
      console.error(e);
      util.error(
        toast,
        "Ha ocurrido un error en el servidor por lo que no se pudo recuperar los datos"
      );
    }
  };

  const prepareEdit = (rowData) => {
    setModel(rowData);
    setEditDlg(true);
  };

  const prepareDelete = (rowData) => {
    setModel(rowData);
    setDeleteDlg(true);
  };

  const actionBody = (rowData) => {
    return (
      <>
        <button
          className="btn-floating waves-effect waves-light green darken-4"
          onClick={() => prepareEdit(rowData)}
          title="Editar"
          style={{ marginLeft: "10px" }}
        >
          <i className="material-icons">edit</i>
        </button>
        <button
          className="btn-floating waves-effect waves-light orange darken-4"
          onClick={() => prepareDelete(rowData)}
          title="Eliminar"
          style={{ marginLeft: "10px" }}
        >
          <i className="material-icons">delete</i>
        </button>
      </>
    );
  };

  const deleteById = async () => {
    if (model) {
      const { type } = await service.deleteById(model._id);
      if (type === "SUCCESS") {
        util.success(toast, "Ha eliminado el registro correctamente");
        setDeleteDlg(false);
        await find();
      } else
        util.error(
          toast,
          "Ha ocurrido un error al tratar de eliminar el registro"
        );
    }
  };

  useEffect(() => {
    find();
  }, []);

  return (
    <>
      <Toast ref={toast} />

      <Modal flag={deleteDlg} setFlag={setDeleteDlg} header="Eliminar Registro">
        <DeleteConfirm
          setDeleteDlg={setDeleteDlg}
          deleteDlg={deleteDlg}
          deleteById={deleteById}
        />
      </Modal>

      <Modal flag={saveDlg} setFlag={setSaveDlg} header="Nuevo Registro">
        <InfDescSave isUpdate={false} find={find} />
      </Modal>

      <Modal flag={editDlg} setFlag={setEditDlg} header="Editar Registro">
        {model && <InfDescSave isUpdate={true} find={find} model={model} />}
      </Modal>

      <div className="row">
        <div className="col s7 m6">
          <h4 className="strong">Descuentos por Influencer</h4>
        </div>
        <div className="col s5 m6 right-align">
          <h4>
            <Btn
              name="actualizar"
              icon="refresh"
              style={{ marginRight: "10px" }}
              execute={find}
            />
            <Btn
              name="nuevo registro"
              icon="add"
              execute={() => setSaveDlg(true)}
            />
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <Card>
            <div className="row">
              <div className="col s12">
                <InfDescTable data={data} actionBody={actionBody} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default InfDescQuery;
