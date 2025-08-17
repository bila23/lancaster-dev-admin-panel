import { useState, useRef } from "react";
import service from "../../../service/modules/ordenCompraService";
import Moment from "react-moment";
import OrdenExcel from "../ordenExcel";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";
import { TabView, TabPanel } from "primereact/tabview";

const OrdenTable = ({ list, loading, find }) => {
  const toast = useRef(null);
  const [userDialog, setUserDialog] = useState(false);
  const [orden, setOrden] = useState("");
  const [excelDialog, setExcelDialog] = useState(false);
  const [productosData, setProductosData] = useState([]);

  function prepareUserDialog(rowData) {
    setOrden(rowData);
    setUserDialog(true);
    if (rowData.productos) setProductosData(rowData.productos);
    else if (rowData.products) setProductosData(rowData.products);
    else setProductosData([]);
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

  const despachadoSelectItems = [
    { label: "SI", value: "DESPACHADO" },
    { label: "NO", value: "NO DESPACHADO" },
  ];

  const changeDespachado = async (idOrden) => {
    await service.despachado(idOrden);
    await find();
  };

  const despachadoBodyTemplate = (rowData) => {
    return (
      <>
        <SelectButton
          value={rowData.despachadoEstado}
          options={despachadoSelectItems}
          onChange={(e) => changeDespachado(rowData._id)}
        />
      </>
    );
  };

  return (
    <>
      <Dialog
        visible={excelDialog}
        onHide={(e) => setExcelDialog(false)}
        header="Generar archivos de Excel"
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <OrdenExcel toast={toast} />
      </Dialog>

      <Dialog
        visible={userDialog}
        onHide={(e) => setUserDialog(false)}
        header="Orden de Compra"
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        {orden && (
          <>
            <div className="row">
              <div className="col s12">
                <table className="striped responsive-table">
                  <tbody>
                    <tr>
                      <th>Tipo:</th>
                      <td>{orden.tipoOrden}</td>
                    </tr>
                    <tr>
                      <th>Fecha:</th>
                      <td>
                        <Moment format="DD/MM/YYYY hh:mm:ss">
                          {orden.date}
                        </Moment>
                      </td>
                    </tr>
                    <tr>
                      <th>Tipo de usuario:</th>
                      <td>
                        {orden.tipoUsuario
                          ? orden.tipoUsuario
                          : orden.userShop
                          ? "REGISTRADO"
                          : "NO REGISTRADO"}
                      </td>
                    </tr>
                    <tr>
                      <th>No. CULQUI:</th>
                      <td>{orden.culquiToken}</td>
                    </tr>
                    <tr>
                      <th>No. NUBEFACT:</th>
                      <td>{orden.id}</td>
                    </tr>
                    <tr>
                      <th>Estado:</th>
                      <td>{orden.status}</td>
                    </tr>
                    <tr>
                      <th>Entrega:</th>
                      <td>
                        {orden.delivery === false &&
                          `En tienda - ${orden.distritoNombre}`}
                        {orden.delivery === true && `Delivery`}
                      </td>
                    </tr>
                    <tr>
                      <th>Transporte:</th>
                      <td>{orden.transporte}</td>
                    </tr>
                    <tr>
                      <th>Plazo Entrega:</th>
                      <td>{orden.plazoEntrega}</td>
                    </tr>
                    <tr>
                      <th>Total:</th>
                      <td>{orden.totalAmount}</td>
                    </tr>
                    {orden.deliveryFree !== undefined && (
                      <tr>
                        <th>Delivery Gratis:</th>
                        <td>{orden.deliveryFree ? "SI" : "NO"}</td>
                      </tr>
                    )}
                    {orden.nubeFact && orden.nubeFact.enlace_del_pdf && (
                      <tr>
                        <th colSpan={2}>
                          <a
                            href={orden.nubeFact.enlace_del_pdf}
                            target="_blank"
                          >
                            [Haga clic para ver el recibo]
                          </a>
                        </th>
                      </tr>
                    )}
                    {orden.errorNubefact && (
                      <tr>
                        <th>Error generado por Nubefact:</th>
                        <td>
                          {orden.textoErrorNubefact && orden.textoErrorNubefact}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <TabView>
                  <TabPanel header="Productos" leftIcon="pi pi-box">
                    {productosData && productosData.length > 0 && (
                      <>
                        <table className="striped responsive-table">
                          <thead>
                            <tr>
                              <th>Categor&iacute;a Padre</th>
                              <th>Categor&iacute;a Hija</th>
                              <th>Producto</th>
                              <th>Precio</th>
                              <th>Cantidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productosData.map((p, index) => (
                              <tr key={index}>
                                <td>{p.categoriaPadre}</td>
                                <td>{p.categoriaHija}</td>
                                <td>{p.nombreProducto}</td>
                                <td>{p.precio}</td>
                                <td>{p.cantidad}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </TabPanel>
                  <TabPanel header="Cliente" leftIcon="pi pi-user">
                    {orden && orden.customerDetails && (
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Nombre:</th>
                              <td>
                                {orden.customerDetails.firstname}{" "}
                                {orden.customerDetails.lastname}
                              </td>
                            </tr>
                            <tr>
                              <th>DNI:</th>
                              <td>{orden.customerDetails.dni}</td>
                            </tr>
                            <tr>
                              <th>Teléfono:</th>
                              <td>{orden.customerDetails.phone}</td>
                            </tr>
                            <tr>
                              <th>Correo:</th>
                              <td>{orden.customerDetails.email}</td>
                            </tr>
                            <tr>
                              <th>País:</th>
                              <td>{orden.customerDetails.country}</td>
                            </tr>
                            <tr>
                              <th>Dirección:</th>
                              <td>{orden.customerDetails.address}</td>
                            </tr>
                            <tr>
                              <th>Ciudad/Pueblo:</th>
                              <td>{orden.customerDetails.town}</td>
                            </tr>
                            <tr>
                              <th>Estado:</th>
                              <td>{orden.customerDetails.state}</td>
                            </tr>
                            <tr>
                              <th>Código Postal:</th>
                              <td>{orden.customerDetails.postalcode}</td>
                            </tr>
                            <tr>
                              <th>Distrito:</th>
                              <td>{orden.customerDetails.district}</td>
                            </tr>
                          </thead>
                        </table>
                      </>
                    )}
                  </TabPanel>
                </TabView>
              </div>
            </div>
          </>
        )}
      </Dialog>

      <Toast ref={toast} />
      <div className="row">
        <div className="col s12">
          <button
            className="btn btn-small waves-effect waves-light black darken-4"
            onClick={find}
            style={{ marginLeft: "25px" }}
          >
            Actualizar
          </button>
          <button
            className="btn btn-small waves-effect waves-light black darken-4"
            onClick={(e) => setExcelDialog(true)}
            style={{ marginLeft: "25px" }}
          >
            Archivos de Excel
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col s12">
          <DataTable
            value={list}
            loading={loading}
            stripedRows
            size="large"
            emptyMessage="No hay registro(s)"
          >
            <Column
              field="_id"
              header="ID"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="id"
              header="Codigo"
              sortable
              filter
              filterMatchMode="contains"
              style={{ width: "10%" }}
            />
            <Column
              field="tipoOrden"
              header="Tipo"
              sortable
              filter
              filterMatchMode="contains"
              style={{ width: "10%" }}
            />
            <Column
              field="fecha"
              header="Fecha"
              sortable
              filter
              filterMatchMode="contains"
              style={{ width: "15%" }}
            />
            <Column
              field="status"
              header="Estado"
              sortable
              filter
              filterMatchMode="contains"
              style={{ width: "10%" }}
            />
            <Column
              field="totalAmount"
              header="Total"
              sortable
              filter
              filterMatchMode="contains"
              style={{ width: "10%" }}
            />
            <Column header="Despachado" body={despachadoBodyTemplate} />
            <Column body={actionBodyTemplate} style={{ width: "5%" }} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default OrdenTable;
