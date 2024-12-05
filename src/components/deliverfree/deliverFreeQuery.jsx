import React, { useState, useEffect, useRef } from "react";
import service from "../../service/modules/deliverFreeService";
import util from "../../service/common/util";
import Modal from "../common/modal";
import DeliverFreeSave from "./deliverFreeSave";
import DeliverProductos from "./deliverProductos";
import Btn from "../common/btn";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const DeliverFreeQuery = () => {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveDlg, setSaveDlg] = useState(false);
  const [model, setModel] = useState("");
  const [editDlg, setEditDlg] = useState(false);
  const [pdcDlg, setPdcDlg] = useState(false);

  const find = async () => {
    setLoading(true);
    try {
      const result = await service.findAll();
      setData(result);
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error al recuperar los datos");
    }
    setLoading(false);
  };

  useEffect(() => {
    find();
  }, []);

  const prepareEdit = (rowData) => {
    setModel(rowData);
    setEditDlg(true);
  };

  const preparePrd = (rowData) => {
    setModel(rowData);
    setPdcDlg(true);
  };

  const actionBody = (rowData) => {
    return (
      <>
        <button
          className="btn-floating btn-medium waves-effect waves-light darken-4 green"
          title="Editar"
          onClick={(e) => prepareEdit(rowData)}
        >
          <i className="material-icons">edit</i>
        </button>
        <button
          className="btn-floating btn-medium waves-effect waves-light darken-4 orange"
          title="Editar"
          onClick={(e) => preparePrd(rowData)}
          style={{ marginLeft: "15px" }}
        >
          <i className="material-icons">send</i>
        </button>
      </>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Modal flag={pdcDlg} setFlag={setPdcDlg} header="Categorias">
        {model && <DeliverProductos toast={toast} idDelivery={model._id} />}
      </Modal>
      <Modal flag={saveDlg} setFlag={setSaveDlg} header="Nuevo Registro">
        <DeliverFreeSave mode="SAVE" toast={toast} find={find} />
      </Modal>
      <Modal flag={editDlg} setFlag={setEditDlg} header="Editar Registro">
        {model && (
          <DeliverFreeSave
            mode="UPDATE"
            toast={toast}
            find={find}
            model={model}
          />
        )}
      </Modal>
      <div className="row">
        <div className="col s12 m6">
          <h4 className="strong">Deliver Gratis</h4>
        </div>
        <div className="col s12 m6 right-align">
          <h4>
            <Btn icon="refresh" name="Actualizar" execute={find} />
            <Btn
              icon="add"
              name="Nuevo Registro"
              execute={() => setSaveDlg(true)}
              style={{ marginLeft: "10px" }}
            />
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <Card>
            <div className="row">
              <div className="col s12">
                <DataTable
                  value={data}
                  loading={loading}
                  stripedRows
                  emptyMessage="No hay registro(s)"
                >
                  <Column
                    field="nombre"
                    header="Nombre"
                    sortable
                    filter
                    filterMatchMode="contains"
                  />
                  <Column
                    field="valorString"
                    header="Valor"
                    sortable
                    filter
                    filterMatchMode="contains"
                  />
                  <Column
                    field="activo"
                    header="Activo"
                    sortable
                    filter
                    body={util.activoBody}
                    filterMatchMode="contains"
                  />
                  <Column
                    field="fechaCreaString"
                    header="Fecha Creaci&oacute;n"
                    sortable
                    filter
                    filterMatchMode="contains"
                  />
                  <Column body={actionBody} />
                </DataTable>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DeliverFreeQuery;
