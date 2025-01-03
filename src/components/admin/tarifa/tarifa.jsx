import React, { useState, useEffect, useRef } from "react";
import tarifaService from "../../../service/modules/tarifaService";
import util from "../../../service/common/util";
import TarifaSave from "./tarifaSave";
import Modal from "../../common/modal";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Tarifa = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [model, setModel] = useState("");
  const [updateDialog, setUpdateDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [saveDlg, setSaveDlg] = useState(false);

  const find = async () => {
    setLoading(true);
    try {
      const result = await tarifaService.findAll();
      setList(result);
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error inesperado");
    }
    setLoading(false);
  };

  useEffect(() => {
    find();
  }, []);

  const prepareEditDialog = (rowData) => {
    setModel(rowData);
    setUpdateDialog(true);
  };

  const headerTemplate = (data) => {
    return (
      <span style={{ fontWeight: "bold" }}>
        <i className="material-icons left">home</i>
        Departamento: {data.departamento}
      </span>
    );
  };

  const editBodyTemplate = (rowData) => {
    return (
      <>
        <button
          className="btn-floating btn-small waves-effect waves-light black darken-4"
          onClick={(e) => prepareEditDialog(rowData)}
        >
          <i className="material-icons">edit</i>
        </button>
      </>
    );
  };

  const deliveryGratisBody = ({ deliveryGratis }) => {
    return deliveryGratis ? "Sí" : "No";
  };

  return (
    <>
      <Modal flag={saveDlg} setFlag={setSaveDlg} header="Nuevo Registro">
        <TarifaSave find={find} mode="SAVE" />
      </Modal>

      <Modal
        flag={updateDialog}
        setFlag={setUpdateDialog}
        header="Editar Tarifa"
      >
        {model && <TarifaSave find={find} mode="UPDATE" row={model} />}
      </Modal>

      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Administraci&oacute;n de Tarifas</h4>
        </div>
        <div className="col s12 m6">
          <h4 className="right">
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={() => setSaveDlg(true)}
            >
              <i className="material-icons left">add</i>
              Guardar
            </button>
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <DataTable
            value={list}
            loading={loading}
            stripedRows
            emptyMessage="No hay registro(s)"
            responsiveLayout="scroll"
            rowGroupMode="subheader"
            groupRowsBy="departamento"
            sortMode="single"
            sortField="departamento"
            sortOrder={1}
            rowGroupHeaderTemplate={headerTemplate}
            scrollable
            scrollHeight="500px"
            expandableRowGroups
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
          >
            <Column
              field="provincia"
              header="Provincia"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="distrito"
              header="Distrito"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="tarifa"
              header="Tarifa"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="plazo"
              header="Plazo"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="deliveryGratis"
              header="Delivery Gratis"
              sortable
              body={deliveryGratisBody}
            />
            <Column body={editBodyTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default Tarifa;
