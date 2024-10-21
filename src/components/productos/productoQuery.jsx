import React, { useState, useEffect, useRef } from "react";
import ProductoService from "../../service/modules/productoService";
import ProductoTable from "./productoTable";
import util from "../../service/common/util";
import Moment from "react-moment";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Galleria } from "primereact/galleria";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { TabView, TabPanel } from "primereact/tabview";

const ProductoQuery = (props) => {
  const toast = useRef(null);

  const [loading, setLoading] = useState(false);
  const [activos, setActivos] = useState([]);
  const [inactivos, setInactivos] = useState([]);
  const [sinFotos, setSinFotos] = useState([]);
  const [showPictures, setShowPictures] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [producto, setProducto] = useState("");

  const find = async () => {
    setLoading(true);
    try {
      const result = await ProductoService.findAllEstado();
      setActivos(result.activos);
      setInactivos(result.inactivos);
      setSinFotos(result.sinFotos);
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error inesperado");
    }
    setLoading(false);
  };

  useEffect(async () => {
    await find();
  }, []);

  const viewPictures = (producto) => {
    setProducto(producto);
    setShowPictures(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <span>
          <button
            className="btn-floating btn-small waves-effect waves-light blue darken-4"
            title="Ver producto"
            onClick={(e) => viewPictures(rowData)}
          >
            <i className="material-icons">search</i>
          </button>
          <button
            className="btn-floating btn-small waves-effect waves-light darken-3 orange"
            title="Editar"
            onClick={(e) => prepareEdit(rowData)}
            style={{ marginLeft: "15px" }}
          >
            <i className="material-icons">edit</i>
          </button>
          {rowData.estado === "ACTIVO" && (
            <button
              className="btn-floating btn-small waves-effect waves-light red"
              title="Inactivar"
              onClick={(e) => prepareInactive(rowData)}
              style={{ marginLeft: "15px" }}
            >
              <i className="material-icons">clear</i>
            </button>
          )}
          {rowData.estado === "INACTIVO" && (
            <button
              className="btn-floating btn-small waves-effect waves-light green darken-3"
              title="Activar"
              onClick={(e) => prepareActive(rowData)}
              style={{ marginLeft: "15px" }}
            >
              <i className="material-icons">check</i>
            </button>
          )}
        </span>
      </>
    );
  };

  const header = (
    <div className="row">
      <div className="col m6">
        {producto.nombre}: ${producto.monto}
      </div>
      <div className="col m6 right-align">Estado: {producto.estado}</div>
    </div>
  );

  const prepareInactive = (producto) => {
    setProducto(producto);
    setShowInactive(true);
  };

  const prepareActive = (producto) => {
    setProducto(producto);
    setShowActive(true);
  };

  const prepareEdit = (producto) => {
    props.history.push(`/producto/${producto._id}`);
  };

  const changeEstado = async (estado) => {
    try {
      await ProductoService.changeEstado(producto._id, estado);
      await find();
      util.success(toast, "Se ha cambiado el estado correctamente");
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error al tratar de cambiar el estado");
    }
    setShowInactive(false);
    setShowActive(false);
  };

  const inactivosToExcel = () => {
    const list = ProductoService.prepareDataToExcel(inactivos);
    exportExcel(list, "inactivos");
  };

  const activosToExcel = () => {
    const list = ProductoService.prepareDataToExcel(activos);
    exportExcel(list, "activos");
  };

  const sinFotosToExcel = () => {
    const list = ProductoService.prepareDataToExcel(sinFotos);
    exportExcel(list, "sinFotos");
  };

  const headerInactivo = (
    <div className="flex align-items-center export-buttons right-align">
      <Button
        type="button"
        label="Exportar a Excel"
        onClick={inactivosToExcel}
        className="p-button-success mr-2"
        data-pr-tooltip="XLS"
      />
    </div>
  );

  const headerActivo = (
    <div className="flex align-items-center export-buttons right-align">
      <Button
        type="button"
        onClick={activosToExcel}
        className="p-button-success"
        data-pr-tooltip="XLS"
        label="Exportar a Excel"
      />
    </div>
  );

  const headerSinFotos = (
    <div className="flex align-items-center export-buttons right-align">
      <Button
        type="button"
        label="Exportar a Excel"
        onClick={sinFotosToExcel}
        className="p-button-success mr-2"
        data-pr-tooltip="XLS"
      />
    </div>
  );

  const exportExcel = (list, fileName) => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(list);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, fileName);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const data = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        module.default.saveAs(data, "productos_" + fileName + ".xlsx");
      }
    });
  };

  return (
    <>
      <Dialog
        visible={showInactive}
        onHide={(e) => setShowInactive(false)}
        showHeader={false}
      >
        {producto && (
          <div
            className="row"
            style={{ paddingTop: "15px", marginBottom: "0px" }}
          >
            <div className="col s12">
              ¿Esta seguro que desea inactivar el producto{" "}
              <span className="strong">{producto.nombre}</span>?
              <div style={{ marginTop: "10px" }}>
                <button
                  className="btn-small waves-effect waves-light grey darken-3"
                  onClick={(e) => changeEstado("INACTIVO")}
                >
                  <i className="material-icons left">check</i>
                  Si
                </button>
                <button
                  className="btn-small waves-effect waves-light grey darken-3"
                  style={{ marginLeft: "15px" }}
                  onClick={(e) => setShowInactive(false)}
                >
                  <i className="material-icons left">cancel</i>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        visible={showActive}
        onHide={(e) => setShowActive(false)}
        showHeader={false}
      >
        {producto && (
          <div
            className="row"
            style={{ paddingTop: "15px", marginBottom: "0px" }}
          >
            <div className="col s12">
              ¿Esta seguro que desea activar el producto{" "}
              <span className="strong">{producto.nombre}</span>?
              <div style={{ marginTop: "10px" }}>
                <button
                  className="btn-small waves-effect waves-light grey darken-3"
                  onClick={(e) => changeEstado("ACTIVO")}
                >
                  <i className="material-icons left">check</i>
                  Si
                </button>
                <button
                  className="btn-small waves-effect waves-light grey darken-3"
                  style={{ marginLeft: "15px" }}
                  onClick={(e) => setShowActive(false)}
                >
                  <i className="material-icons left">cancel</i>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        visible={showPictures}
        header={header}
        breakpoints={{ "960px": "75vw" }}
        onHide={(e) => setShowPictures(false)}
      >
        {producto && (
          <table style={{ marginBottom: "25px" }}>
            <tbody>
              <tr>
                <td>
                  <div className="strong">Código / ID:</div> {producto.codigo} /{" "}
                  {producto.id}
                </td>
                <td>
                  <div className="strong">Talla:</div> {producto.talla}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="strong">Categoria Padre:</div>{" "}
                  {producto.categoriaNombre}
                </td>
                <td>
                  <div className="strong">Categoria Hija:</div>{" "}
                  {producto.categoriaHijaNombre}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="strong">Código Completo:</div>{" "}
                  {producto.codigoCompleto}
                </td>
                <td>
                  <div className="strong">SUNAT:</div> {producto.sunat}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="strong">Color:</div>
                  <a
                    className="btn-floating waves-effect waves-light"
                    style={{ backgroundColor: producto.colorCodigo }}
                  ></a>
                </td>
                <td>
                  <div className="strong">Calidad:</div>{" "}
                  <Rating
                    value={producto.calidad}
                    readOnly
                    color="#FF8000"
                    cancel={false}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="strong">Especificaciones:</div>{" "}
                  {producto.especificaciones}
                </td>
                <td>
                  <div className="strong">Cantidad:</div> {producto.cantidad}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="strong">Etiquetas:</div>
                  <ul className="browser-default">
                    {producto &&
                      producto.etiqueta &&
                      producto.etiqueta.length > 0 &&
                      producto.etiqueta.map((row, index) => (
                        <li key={index}>{row}</li>
                      ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="strong">Usuario crea:</div>{" "}
                  {producto.usuarioCrea}
                </td>
                <td>
                  <div className="strong">Fecha crea:</div>{" "}
                  <Moment format="DD/MM/YYYY HH:mm:ss">
                    {producto.fechaCrea}
                  </Moment>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <Galleria
          value={producto.fotos}
          item={util.imageTemplate}
          circular
          showItemNavigators
          showThumbnails={false}
          showItemNavigatorsOnHover
          showIndicators
        />
      </Dialog>

      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Consulta de Productos</h4>
        </div>
        <div className="col s12 m6 right-align">
          <h4>
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={find}
            >
              Actualizar
            </button>
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <div className="card" style={{ padding: "15px" }}>
            <TabView>
              <TabPanel header="Activos">
                <ProductoTable
                  list={activos}
                  actionBodyTemplate={actionBodyTemplate}
                  loading={loading}
                  headerTable={headerActivo}
                />
              </TabPanel>
              <TabPanel header="Sin Fotos">
                <ProductoTable
                  list={sinFotos}
                  actionBodyTemplate={actionBodyTemplate}
                  loading={loading}
                  headerTable={headerSinFotos}
                />
              </TabPanel>
              <TabPanel header="Inactivos">
                <ProductoTable
                  list={inactivos}
                  actionBodyTemplate={actionBodyTemplate}
                  loading={loading}
                  headerTable={headerInactivo}
                />
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductoQuery;
