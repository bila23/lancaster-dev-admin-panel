import React, { useState, useEffect, useRef } from "react";
import authService from "../../service/common/authService";
import ProductoService from "../../service/modules/productoService";
import CategoriaService from "../../service/modules/categoriaService";
import util from "../../service/common/util";
import Loading from "../common/loading";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from "primereact/tabview";
import { BreadCrumb } from "primereact/breadcrumb";

const CargaMasiva = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const fileUploadRef = useRef(null);
  const [catHijas, setCatHijas] = useState([]);
  const [result, setResult] = useState("");
  const [resultImages, setResultImages] = useState([]);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [updateList, setUpdateList] = useState([]);

  const uploadFiles = async (event) => {
    setMessage("");
    setResult("");
    setResultImages([]);
    setUpdateList([]);

    setLoading(true);
    let formData = new FormData();
    const files = event.files;
    let file;
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      formData.append(`file${i}`, file);
    }
    try {
      const model = await ProductoService.saveMany(
        formData,
        authService.getUser()
      );
      if (model.resultExcel) prepareResult(model.resultExcel);
      if (model.resultImageArray.length > 0) {
        util.info(
          toast,
          "Se han cargado las imagenes, revisa el log para ver su detalle"
        );
        setResultImages(model.resultImageArray);
      }
      event.options.clear();
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error al cargar los datos");
    }
    setLoading(false);
  };

  const prepareResult = (model) => {
    setResult(model);

    if (
      model.data &&
      model.data.productoUpdates &&
      model.data.productoUpdates.length > 0
    )
      setUpdateList(model.data.productoUpdates);

    const type = model.type;
    if (type === "SUCCESS" && model.countSuccess > 0) {
      setSeverity("success");
      setMessage(
        `Se han ingresado correctamente todos los productos, ${model.countSuccess} en total`
      );
      util.success(toast, "El proceso ha terminado satisfactoriamente");
    } else if (type === "SUCCESS" && model.countSuccess === 0) {
      setSeverity("info");
      setMessage(
        `No hay ningun registro ingresado, todos los del archivo ya existen en el sistema`
      );
      util.success(toast, "El proceso ha terminado satisfactoriamente");
    } else if (type === "ERROR_MSG") {
      setSeverity("error");
      setMessage(model.msg);
      util.error(toast, "Ha ocurrido un error");
    } else if (type === "WITH ERROR") {
      setSeverity("warn");
      setMessage(
        `Se han guardado ${model.countSuccess} producto(s), abajo esta el detalle de los que no se pudieron guardar`
      );
      util.warning(toast, `Se guardaron ${model.countSuccess} producto(s)`);
    }
  };

  useEffect(async () => {
    const catListHijas = await CategoriaService.findHijas();
    setCatHijas(catListHijas);
  }, []);

  const updateOne = async (model) => {
    setLoading(true);
    try {
      await ProductoService.updateOnlyInfo(model);
      let list = updateList.filter(function (el) {
        return el._id != model._id;
      });
      setUpdateList(list);
      util.success(toast, "Se ha actualizado el registro correctamente");
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error inesperado");
    }
    setLoading(false);
  };

  const allUpdate = async () => {
    setLoading(true);
    const result = await ProductoService.allUpdates(updateList);
    if (result.type === "SUCCESS") {
      util.success(toast, "Se han actualizado todos los productos");
      setUpdateList([]);
      setMessage("");
      setResultImages([]);
      setResult("");
    } else
      util.error(
        toast,
        "Ha ocurrido un error al tratar de actualizar los productos"
      );
    setLoading(false);
  };

  const items = [{ label: "Productos" }, { label: "Carga Masiva" }];

  return (
    <>
      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Carga Masiva de Productos</h4>
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
      <div className="container">
        <div className="card" style={{ padding: "15px" }}>
          <div className="row">
            <div className="col s12">
              Estas son las indicaciones que debes seguir:
              <ul className="browser-default" style={{ lineHeight: "30px" }}>
                <li>
                  Debes anexar un archivo de excel con toda la
                  informaci&oacute;n y las imágenes de los productos.
                </li>
                <li>El campo calidad debe ser un numero de 1 a 5.</li>
                <li>
                  El nombre de los archivos de las imágenes debe ser: [ID de la
                  imagen]_[orden de la imagen].extensi&oacute;n de la imagen. Es
                  importante que cada valor este separado por un gui&oacute;n
                  bajo.
                </li>
                <li>
                  En el campo de etiquetas, estas deben estar separadas por
                  coma.
                </li>
                <li>
                  Puedes cargar solo las imágenes si el producto ya existe.
                </li>
                <li>
                  En el Excel, debe poner el código de las categorías padres y
                  categoría hijas, estos son los códigos para tu referencia:
                  <Accordion style={{ marginTop: "15px" }}>
                    <AccordionTab header="Listado de Categorías">
                      <table className="highlight centered responsive-table">
                        <thead>
                          <tr>
                            <th>Padre</th>
                            <th>Código Padre</th>
                            <th>Nombre</th>
                            <th>Código Hijo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catHijas.length > 0 &&
                            catHijas.map((hija, index) => (
                              <tr key={index}>
                                <td>{hija.padre && hija.padre.nombre}</td>
                                <td>{hija.padre && hija.padre.codigo}</td>
                                <td>{hija.nombre}</td>
                                <td>{hija.codigo}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </AccordionTab>
                  </Accordion>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <FileUpload
                ref={fileUploadRef}
                name="file"
                id="file"
                customUpload
                uploadHandler={uploadFiles}
                multiple
                accept="/*"
                headerTemplate={util.headerImageTemplate}
                itemTemplate={ProductoService.itemTemplate}
                emptyTemplate={util.emptyImageTemplate}
                chooseOptions={util.chooseTextOptions}
                uploadOptions={util.uploadProductoOptions}
                cancelOptions={util.cancelTextOptions}
              />
            </div>
          </div>
          <div className="row">
            <div className="col s12">{loading && <Loading />}</div>
          </div>
          <div className="row">
            <div className="col s12">
              {result && (
                <Message
                  severity={severity}
                  text={message}
                  style={{ width: "100%" }}
                ></Message>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <TabView>
                <TabPanel header="Productos que no se guardaron">
                  {result.type === "WITH ERROR" && (
                    <div className="row">
                      <div className="col s12">
                        <table className="striped">
                          <thead>
                            <tr>
                              <th>Descripci&oacute;n del error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.data.error.map((row, index) => (
                              <tr key={index}>
                                <td>{row.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </TabPanel>
                <TabPanel header="Imágenes cargadas">
                  {resultImages.length > 0 && (
                    <table className="striped">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Nombre de imagen</th>
                          <th>Notas Extras</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultImages.length > 0 &&
                          resultImages.map((img, index) => (
                            <tr key={index}>
                              <td>
                                {img.type === "SUCCESS" ? (
                                  <>
                                    <i
                                      className="material-icons left"
                                      style={{ color: "green" }}
                                    >
                                      done
                                    </i>
                                    <span style={{ color: "green" }}>
                                      CARGADO
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <i
                                      className="material-icons left"
                                      style={{ color: "red" }}
                                    >
                                      error
                                    </i>
                                    <span style={{ color: "red" }}>ERROR</span>
                                  </>
                                )}
                              </td>
                              <td>{img.filename}</td>
                              <td>{img.msg}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CargaMasiva;
