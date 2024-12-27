import React, { useState, useEffect, useRef } from "react";
import service from "../../service/modules/deliveryMontoFreeService";
import DmfSave from "./dmfSave";
import DmfTable from "./dmfTable";
import Btn from "../common/btn";
import util from "../../service/common/util";
import Modal from "../common/modal";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const DmfQuery = () => {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewDlg, setViewDlg] = useState(false);
  const [editDlg, setEditDlg] = useState(false);
  const [deleteDlg, setDeleteDlg] = useState(false);
  const [saveDlg, setSaveDlg] = useState(false);
  const [model, setModel] = useState("");

  const find = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const prepareShow = (rowData) => {
    setModel(rowData);
    setViewDlg(true);
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

  useEffect(() => {
    find();
  }, []);

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

  return (
    <>
      <Modal flag={deleteDlg} setFlag={setDeleteDlg} header="Eliminar Registro">
        <div className="row" style={{ marginTop: "15px" }}>
          <div className="col s12" style={{ fontSize: "18px" }}>
            ¿Esta seguro que desea eliminar el registro?
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

      <Modal flag={saveDlg} setFlag={setSaveDlg} header="Nuevo Registro">
        <DmfSave isUpdate={false} find={find} />
      </Modal>

      <Modal flag={editDlg} setFlag={setEditDlg} header="Editar Registro">
        {model && <DmfSave isUpdate={true} find={find} model={model} />}
      </Modal>

      <div className="row">
        <div className="col s7 m6">
          <h4 className="strong">Monto para Delivery Gratis</h4>
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
      <style>{util.cssGrayBackground}</style>
      <Toast ref={toast} />
      <div className="row">
        <div className="col s12">
          <Card>
            <div className="row">
              <div className="col s12">
                <DmfTable data={data} actionBody={actionBody} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DmfQuery;
