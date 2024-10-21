import React, { useState, useEffect, useRef } from "react";
import usuarioService from "../../service/admin/usuarioService";
import util from "../../service/common/util";
import UserForm from "./usuarioForm";
import UsuarioEdit from "./usuarioEdit";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const UsuarioQuery = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [newDialog, setnewDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [id, setId] = useState("");
  const items = [{ label: "Administración" }, { label: "Usuario" }];

  const find = async () => {
    setLoading(true);
    try {
      const result = await usuarioService.findAll();
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

  const activoBodyTemplate = (rowData) => {
    return <>{rowData.activo ? "ACTIVO" : "INACTIVO"}</>;
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

  const header = () => {
    return (
      <div className="row">
        <div className="col s12 right-align">
          <button
            className="btn waves-effect waves-light black darken-4"
            onClick={(e) => setnewDialog(true)}
          >
            Nuevo Usuario
          </button>
        </div>
      </div>
    );
  };

  const onHideNewDialog = async () => {
    await find();
    setnewDialog(false);
    setUpdateDialog(false);
  };

  const prepareEditDialog = (rowData) => {
    setId(rowData._id);
    setUpdateDialog(true);
  };

  return (
    <>
      <Dialog
        visible={updateDialog}
        header="Editar Usuario"
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "50vw" }}
        onHide={onHideNewDialog}
      >
        <UsuarioEdit toast={toast} id={id} setUpdateDialog={setUpdateDialog} />
      </Dialog>

      <Dialog
        visible={newDialog}
        header="Nuevo Usuario"
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "50vw" }}
        onHide={onHideNewDialog}
      >
        <UserForm toast={toast} setnewDialog={setnewDialog} />
      </Dialog>

      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Administraci&oacute;n de Usuarios</h4>
        </div>
        <div className="col s12 m6">
          <h4 className="right">
            <BreadCrumb
              model={items}
              home={util.home}
              style={{ heigth: "37px" }}
            />
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <DataTable
            value={list}
            loading={loading}
            header={header}
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
              field="correo"
              header="Correo"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="activo"
              header="Activo"
              sortable
              body={activoBodyTemplate}
              filter
              filterMatchMode="contains"
            />
            <Column body={editBodyTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default UsuarioQuery;
