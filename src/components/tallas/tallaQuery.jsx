import React, { useState, useEffect, useRef } from "react";
import TallaService from "../../service/admin/TallaService";
import TallaInsert from "./tallaInsert";
import util from "../../service/common/util";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TallaQuery = () => {
  const toast = useRef(null);
  const dt = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [newDialog, setNewDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [id, setId] = useState("");

  const find = async () => {
    setLoading(true);
    try {
      const result = await TallaService.findAll();
      setList(result);
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error inesperado");
    }
    setLoading(false);
  };

  useEffect(async () => {
    await find();
  }, []);

  const prepareUpdate = (id) => {
    setId(id);
    setUpdateDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <span>
          <button
            className="btn-floating btn-small waves-effect waves-light darken-3 orange"
            title="Editar"
            onClick={(e) => prepareUpdate(rowData._id)}
          >
            <i className="material-icons">edit</i>
          </button>
          {rowData.estado === "ACTIVO" && (
            <button
              className="btn-floating btn-small waves-effect waves-light red"
              title="Inactivar"
              style={{ marginLeft: "15px" }}
            >
              <i className="material-icons">clear</i>
            </button>
          )}
          {rowData.estado === "INACTIVO" && (
            <button
              className="btn-floating btn-small waves-effect waves-light green darken-3"
              title="Activar"
              style={{ marginLeft: "15px" }}
            >
              <i className="material-icons">check</i>
            </button>
          )}
        </span>
      </>
    );
  };

  return (
    <>
      <Dialog
        visible={updateDialog}
        onHide={(e) => setUpdateDialog(false)}
        header="Editar Talla"
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <TallaInsert
          toast={toast}
          setList={setList}
          setNewDialog={setUpdateDialog}
          id={id}
        />
      </Dialog>

      <Dialog
        visible={newDialog}
        onHide={(e) => setNewDialog(false)}
        header="Nueva Talla"
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <TallaInsert
          toast={toast}
          setList={setList}
          setNewDialog={setNewDialog}
          id={null}
        />
      </Dialog>

      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Administración de Tallas</h4>
        </div>
        <div className="col s12 m6 right-align">
          <h4>
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={(e) => setNewDialog(true)}
            >
              Nuevo Registro
            </button>
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <DataTable
            ref={dt}
            value={list}
            loading={loading}
            stripedRows
            paginator
            rows={10}
            filterDisplay="row"
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
              field="estado"
              header="Estado"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column body={actionBodyTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default TallaQuery;
