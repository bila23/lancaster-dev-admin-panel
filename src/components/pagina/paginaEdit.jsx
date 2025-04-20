import React, { useState, useEffect, useRef } from "react";
import paginaService from "../../service/modules/paginaService";
import util from "../../service/common/util";
import { Carousel } from "primereact/carousel";
import { FileUpload } from "primereact/fileupload";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";

const PaginaEdit = (props) => {
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const [tema, setTema] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [link, setLink] = useState("");
  const [fotos, setFotos] = useState([]);
  const [idFoto, setIdFoto] = useState("");
  const [showDeleteFoto, setShowDeleteFoto] = useState(false);
  const [id, setId] = useState("");

  const updateFotos = async (event) => {
    const files = event.files;
    const result = await paginaService.updateFotos(id, files);
    if (result.type === "SUCCESS") {
      util.success(toast, "Se han actualizado las imágenes correctamente");
      event.options.clear();
      await findById(id);
    } else util.error(toast, result.msg);
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

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-strike" aria-label="Strike"></button>
        <button className="ql-link" aria-label="Link"></button>
      </span>
    );
  };

  const header = renderHeader();

  const findById = async (id) => {
    const model = await paginaService.findById(id);
    fill(model);
  };

  const fill = (model) => {
    setTema(model.tema);
    setTitulo(model.titulo);
    setSubtitulo(model.subtitulo);
    setDescripcion(model.descripcion);
    setFotos(model.fotos);
    setLink(model.link);
  };

  useEffect(async () => {
    const idPagina = props.match.params.id;
    setId(idPagina);
    await findById(idPagina);
  }, []);

  const update = async () => {
    if (!descripcion) util.warning(toast, "Debe ingresar la descripción");
    else {
      const body = {
        tema,
        titulo,
        subtitulo,
        descripcion,
        link,
        _id: id,
      };
      try {
        await paginaService.update(body);
        util.success(toast, "Se ha actualizado correctamente el registro");
      } catch (e) {
        console.error(e);
        util.error(
          toast,
          "Ha ocurrido un error al tratar de actualizar el registro"
        );
      }
    }
  };

  const imageTemplate = (item) => {
    return (
      <div className="product-item">
        <div className="product-item-content">
          <div className="mb-3">
            <img style={{ width: "50%" }} src={item.url} />
          </div>
          <div>
            <div className="car-buttons mt-5">
              <button
                className="btn-floating waves-effect waves-light red"
                onClick={(e) => prepareDeleteFoto(item.nombre)}
              >
                <i className="material-icons">delete</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const prepareDeleteFoto = async (image) => {
    const result = await paginaService.removeFoto(id, image);
    if (result.type === "SUCCESS") {
      util.success(toast, "Se ha eliminado correctamente la foto");
      fill(result.model);
      setShowDeleteFoto(true);
    } else util.error(toast, result.message);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Editar Diseño de Pagina</h4>
        </div>
        <div className="col s12 m6 right-align">
          <h4>
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={(e) => props.history.push("/pagina")}
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
                    <div className="col s12 input-field">
                      <h6 className="strong">{tema && tema}</h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 input-field">
                      <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        id="titulo"
                      />
                      <label htmlFor="titulo" className="active">
                        Ingrese el titulo:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 input-field">
                      <input
                        type="text"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        id="subtitulo"
                      />
                      <label htmlFor="subtitulo" className="active">
                        Ingrese el subtitulo:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 input-field">
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        id="link"
                      />
                      <label htmlFor="link" className="active">
                        Ingrese el link:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12">
                      <div>Descripción de la sección:</div>
                      <Editor
                        style={{ height: "120px" }}
                        value={descripcion}
                        id="descripcion"
                        onTextChange={(e) => setDescripcion(e.htmlValue)}
                        headerTemplate={header}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12">
                      <button
                        className="btn waves-effect waves-light black darken-4"
                        onClick={update}
                      >
                        Actualizar
                      </button>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header="Actualizar fotos">
                  <>
                    {fotos && fotos.length > 0 && (
                      <div className="row">
                        <div className="col s12 carousel-demo">
                          <Carousel
                            value={fotos}
                            numVisible={3}
                            numScroll={1}
                            header={
                              <>
                                <h6 className="strong">
                                  Im&aacute;genes Actuales:
                                </h6>
                              </>
                            }
                            itemTemplate={imageTemplate}
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

export default PaginaEdit;
