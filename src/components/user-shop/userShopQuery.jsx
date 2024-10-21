import React, { useState, useEffect, useRef } from "react";
import userShopService from "../../service/modules/userShopService";
import util from "../../service/common/util";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Moment from "react-moment";

const UserShopQuery = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [user, setUser] = useState("");
  const [userDialog, setUserDialog] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const items = [{ label: "Administración" }, { label: "Usuario Registrados" }];

  const find = async () => {
    setLoading(true);
    try {
      const result = await userShopService.findAll();
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

  async function prepareUserDialog(rowData) {
    const ordenList = await userShopService.findOrden(rowData.email);
    setOrdenes(ordenList);
    setUser(rowData);
    setUserDialog(true);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <button
          className="btn-floating btn-small waves-effect waves-light black darken-4"
          onClick={(e) => prepareUserDialog(rowData)}
        >
          <i className="material-icons">search</i>
        </button>
      </>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="row">
        <div className="col s12">
          <h6 className="strong">Listado de Productos</h6>
          <DataTable value={data.productos} responsiveLayout="scroll">
            <Column field="producto" header="Nombre" sortable></Column>
            <Column
              field="categoriaPadre"
              header="Cat. Padre"
              sortable
            ></Column>
            <Column field="categoriaHija" header="Cat. Hija" sortable></Column>
            <Column field="talla" header="Talla" sortable></Column>
            <Column field="color" header="Color" sortable></Column>
          </DataTable>
        </div>
      </div>
    );
  };

  const allowExpansion = (rowData) => {
    return rowData.productos.length > 0;
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={userDialog}
        onHide={(e) => setUserDialog(false)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
        header="Informaci&oacute;n de Usuario"
      >
        {user && (
          <>
            <div className="row">
              <div className="col s12">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre:</th>
                      <td>
                        {user.firstname} {user.lastname}
                      </td>
                      <th>Pa&iacute;s:</th>
                      <td>{user.country}</td>
                    </tr>
                    <tr>
                      <th>Direcci&oacute;n:</th>
                      <td>{user.address}</td>
                      <th>DNI:</th>
                      <td>{user.dni}</td>
                    </tr>
                    <tr>
                      <th>Correo:</th>
                      <td>{user.email}</td>
                      <th>Tel&eacute;fono:</th>
                      <td>{user.phone}</td>
                    </tr>
                    <tr>
                      <th>C&oacute;digo Postal:</th>
                      <td>{user.postalcode}</td>
                      <th>Estado:</th>
                      <td>{user.state}</td>
                    </tr>
                    <tr>
                      <th>Fecha de creaci&oacute;n:</th>
                      <td>
                        <Moment format="DD/MM/YYYY hh:mm:ss">
                          {user.dateCreation}
                        </Moment>
                      </td>
                      <th></th>
                      <td></td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <h6 className="strong">Ordenes de Compras</h6>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                {ordenes && ordenes.length > 0 && (
                  <>
                    <DataTable
                      value={ordenes}
                      expandedRows={expandedRows}
                      onRowToggle={(e) => setExpandedRows(e.data)}
                      responsiveLayout="scroll"
                      rowExpansionTemplate={rowExpansionTemplate}
                      dataKey="_id"
                    >
                      <Column
                        expander={allowExpansion}
                        style={{ width: "3em" }}
                      />
                      <Column field="fecha" header="Fecha" sortable></Column>
                      <Column field="tipoOrden" header="Tipo" sortable></Column>
                      <Column field="status" header="Estado" sortable></Column>
                      <Column
                        field="totalAmount"
                        header="Total"
                        sortable
                      ></Column>
                    </DataTable>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Dialog>

      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">
            Consulta de Usuarios Registrados
            <button
              className="btn btn-small waves-effect waves-light black darken-4"
              onClick={find}
              style={{ marginLeft: "25px" }}
            >
              Actualizar
            </button>
          </h4>
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
            stripedRows
            emptyMessage="No hay registro(s)"
          >
            <Column
              field="firstname"
              header="Nombre"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="lastname"
              header="Apellido"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="email"
              header="Correo"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="dni"
              header="DNI"
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

export default UserShopQuery;
