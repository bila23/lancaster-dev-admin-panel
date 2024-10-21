import React, { useState, useEffect, useRef } from "react";
import ProductoService from "../../service/modules/productoService";
import CategoriaService from "../../service/modules/categoriaService";
import util from "../../service/common/util";
import ProductoForm from "./productoForm";
import { Dialog } from "primereact/dialog";
import { Carousel } from "primereact/carousel";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";

const ProductoEdit = (props) => {
  const toast = useRef(null);
  const [form, setForm] = useState("");
  const [errors, setErrors] = useState({});
  const [codes, setCodes] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [idFoto, setIdFoto] = useState("");
  const [showDeleteFoto, setShowDeleteFoto] = useState(false);
  const [idProducto, setIdProducto] = useState("");
  const fileUploadRef = useRef(null);
  const [catPadres, setCatPadres] = useState([]);
  const [catHijas, setCatHijas] = useState([]);

  const findById = async (id) => {
    const model = await ProductoService.findOnlyById(id);
    fillForm(model);
    return model;
  };

  useEffect(async () => {
    const id = props.match.params.id;
    setIdProducto(id);
    const result = await findById(id);

    const catPadresList = await CategoriaService.findPadres();
    const catHijasList = await CategoriaService.findHijasByPadre(
      result.categoria
    );
    setCatPadres(catPadresList);
    setCatHijas(catHijasList);
  }, []);

  const fillForm = (model) => {
    const formNew = { ...model };
    setForm(formNew);
  };

  const uploadFiles = async () => {
    const validate = ProductoService.validateForm(form, setErrors);
    if (validate) {
      try {
        const result = await ProductoService.updateInfo(form);
        if (result.type === "SUCCESS")
          util.success(toast, "Se ha guardado correctamente el producto");
      } catch (e) {
        util.error(
          toast,
          "Ha ocurrido un error al tratar de actualizar el producto"
        );
      }
    } else
      util.warning(
        toast,
        "Favor revisar el formulario, hay uno o más campos que estan incorrectos"
      );
  };

  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "600px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "480px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const deleteImage = async () => {
    const result = await ProductoService.deleteFoto(idProducto, idFoto);
    if (result.type === "OK") {
      await findById(idProducto);
      setShowDeleteFoto(false);
      util.success(toast, "Se ha eliminado la foto");
    } else
      util.error(toast, "Ha ocurrido un error al tratar de eliminar la foto");
  };

  const productTemplate = (product) => {
    return (
      <div className="product-item">
        <div className="product-item-content">
          <div className="mb-3">
            <img style={{ width: "50%" }} src={product.url} />
          </div>
          <div>
            <div className="car-buttons mt-5">
              <button
                className="btn-floating waves-effect waves-light red"
                onClick={(e) => prepareDeleteFoto(product._id)}
              >
                <i className="material-icons">delete</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  function prepareDeleteFoto(id) {
    setIdFoto(id);
    setShowDeleteFoto(true);
  }

  const updateFotos = async (event) => {
    const files = event.files;
    const result = await ProductoService.updateFotos(idProducto, files);
    if (result.type === "SUCCESS") {
      util.success(toast, "Se han actualizado las imágenes correctamente");
      event.options.clear();
      await findById(idProducto);
    } else util.error(toast, result.msg);
  };

  return (
    <>
      <Dialog
        visible={showDeleteFoto}
        onHide={(e) => setShowDeleteFoto(false)}
        showHeader={false}
      >
        {idFoto && (
          <div
            className="row"
            style={{ paddingTop: "15px", marginBottom: "0px" }}
          >
            <div className="col s12">
              ¿Esta seguro que desea eliminar la imagen?
              <div style={{ marginTop: "10px" }}>
                <button
                  className="btn-small waves-effect waves-light grey darken-3"
                  onClick={deleteImage}
                >
                  <i className="material-icons left">check</i>
                  Si
                </button>
                <button
                  className="btn-small waves-effect waves-light grey darken-3"
                  style={{ marginLeft: "15px" }}
                  onClick={(e) => setShowDeleteFoto(false)}
                >
                  <i className="material-icons left">cancel</i>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Editar Producto</h4>
        </div>
        <div className="col s12 m6 right-align">
          <h4>
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={(e) => props.history.push("/productos")}
            >
              <i className="material-icons left">arrow_back</i>
              Regresar
            </button>
          </h4>
        </div>
      </div>
      <div className="container">
        <div className="card" style={{ padding: "15px" }}>
          <div className="row">
            <div className="col s12">
              <TabView>
                <TabPanel header="Actualizar informaci&oacute;n">
                  <div className="row">
                    <div className="col s12">
                      <h6>
                        Puede hacer las modificaciones necesarias en este
                        producto, cuando haya finalizado haga clic en el
                        bot&oacute;n Actualizar.
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12">
                      <ProductoForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        codes={codes}
                        setCodes={setCodes}
                        uploadFiles={uploadFiles}
                        disabled={disabled}
                        setDisabled={setDisabled}
                        activateLabel={true}
                        showImages={false}
                        catPadres={catPadres}
                        catHijas={catHijas}
                      />
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header="Actualizar fotos">
                  <>
                    {form && form.fotos && form.fotos.length > 0 && (
                      <div className="row">
                        <div className="col s12 carousel-demo">
                          <Carousel
                            value={form.fotos}
                            numVisible={3}
                            numScroll={1}
                            header={
                              <>
                                <h6 className="strong">
                                  Im&aacute;genes Actuales:
                                </h6>
                              </>
                            }
                            itemTemplate={productTemplate}
                            responsiveOptions={responsiveOptions}
                          />
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col s12">
                        <h6 className="strong">
                          Si deseas subir mas fotos, puedes agregarlas en este
                          espacio:
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col s12">
                        <FileUpload
                          ref={fileUploadRef}
                          name="file"
                          id="file"
                          customUpload
                          uploadHandler={updateFotos}
                          multiple
                          accept="image/*"
                          headerTemplate={util.headerImageTemplate}
                          itemTemplate={util.itemImageNoMsgTemplate}
                          emptyTemplate={util.emptyImageTemplate}
                          chooseOptions={util.chooseTextOptions}
                          uploadOptions={util.uploadProductoOptions}
                          cancelOptions={util.cancelTextOptions}
                        />
                      </div>
                    </div>
                  </>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductoEdit;
