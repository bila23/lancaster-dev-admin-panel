import React, { useState, useEffect, useRef } from "react";
import authService from "../../service/common/authService";
import paginaService from "../../service/modules/paginaService";
import util from "../../service/common/util";
import Loading from "../common/loading";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Galleria } from "primereact/galleria";
import { Link } from "react-router-dom";

const PaginaForm = () => {
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const [tema, setTema] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [imageDialog, setImageDialog] = useState(false);
  const [id, setId] = useState("");
  const [fotos, setFotos] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const items = [{ label: "Administración" }, { label: "Diseño de Pagina" }];
  const temasList = [
    { label: "Tema Principal I", value: "Tema Principal I" },
    { label: "Tema Principal II", value: "Tema Principal II" },
    { label: "Slider", value: "Slider" },
    { label: "Collection", value: "Collection" },
    { label: "Collection Type", value: "Collection Type" },
    { label: "Acerca de encabezado", value: "Acerca de encabezado" },
    { label: "Acerca de segunda sección", value: "Acerca de segunda sección" },
    { label: "Empleados", value: "Empleados" },
    { label: "Compromiso social", value: "Compromiso social" },
    { label: "Sección tienda superior", value: "Sección tienda superior" },
    { label: "Seccion tienda inferior", value: "Seccion tienda inferior" },
    { label: "Parallax", value: "Parallax" },
    { label: "Nuestra historia", value: "Nuestra historia" },
    { label: "Pie de pagina", value: "Pie de pagina" },
    { label: "Contáctanos: Dirección", value: "Contáctanos: Dirección" },
    { label: "Contáctanos: teléfono", value: "Contáctanos: teléfono" },
    { label: "Contáctanos: correo", value: "Contáctanos: correo" },
  ];

  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5,
    },
    {
      breakpoint: "768px",
      numVisible: 3,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
    },
  ];

  useEffect(async () => {
    await find();
  }, []);

  const find = async () => {
    setLoading(true);
    const result = await paginaService.findAll();
    setList(result);
    setLoading(false);
  };

  const prepareImageDialog = (rowData) => {
    setFotos(rowData.fotos);
    setImageDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <button
          className="btn-floating btn-small waves-effect waves-light blue darken-3"
          onClick={(e) => prepareImageDialog(rowData)}
        >
          <i className="material-icons">image</i>
        </button>
        <Link
          className="btn-floating btn-small waves-effect waves-light green darken-3"
          to={`/pagina-edit/${rowData._id}`}
          style={{ marginLeft: "15px" }}
        >
          <i className="material-icons">edit</i>
        </Link>
        <button
          className="btn-floating btn-small waves-effect waves-light red darken-3"
          onClick={(e) => prepareDelete(rowData._id)}
          style={{ marginLeft: "15px" }}
        >
          <i className="material-icons">delete</i>
        </button>
      </>
    );
  };

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

  const uploadFiles = async (event) => {
    if (!tema) util.warning(toast, "Debe seleccionar una seccion");
    else if (!descripcion) util.warning(toast, "Debe definir la descripcion");
    else {
      setLoading(true);
      try {
        await doUpload(event);
      } catch (e) {
        console.error(e);
        util.error(toast, "Ha ocurrido un error inesperado");
      }
      setLoading(false);
    }
  };

  const itemTemplate = (item) => {
    return <img src={`${item}`} style={{ width: "100%" }} />;
  };

  const descBodyTemplate = (rowData) => {
    return (
      <div dangerouslySetInnerHTML={{ __html: rowData.descripcion }}></div>
    );
  };

  const prepareDelete = (id) => {
    setId(id);
    setDeleteDialog(true);
  };

  const closeDeleteDialog = async () => {
    await paginaService.remove(id);
    util.success(toast, "Se ha eliminado el registro correctamente");
    const result = list.filter((e) => e._id !== id);
    setList(result);
    setDeleteDialog(false);
  };

  const saveNoImages = async () => {
    if (!tema) util.warning(toast, "Debe seleccionar una seccion");
    else if (!descripcion) util.warning(toast, "Debe definir la descripcion");
    else {
      setLoading(true);
      try {
        const body = {
          tema: tema,
          titulo: titulo,
          subtitulo: subtitulo,
          descripcion: descripcion,
          usuarioCrea: user,
          fotos: null,
        };
        const result = await paginaService.save(body);
        if (result.type === "SUCCESS") {
          await find();
          setDescripcion("");
          setTema("");
          setTitulo("");
          setSubtitulo("");
          util.success(toast, "Se ha guardado correctamente el registro");
        } else
          util.error(
            toast,
            "Ha ocurrido un error al tratar de subir el registro"
          );
      } catch (e) {
        console.error(e);
        util.error(toast, "Ha ocurrido un error inesperado");
      }
      setLoading(false);
    }
  };

  const doUpload = async (event) => {
    let formData = new FormData();
    const files = event.files;
    let file;
    formData.append("tema", tema);
    formData.append("descripcion", descripcion);
    formData.append("titulo", titulo);
    formData.append("subtitulo", subtitulo);
    formData.append("usuarioCrea", user);
    for (let i = 0; i < files.length; i++) {
      file = files[i];
      formData.append(`file${i}`, file);
    }
    const result = await paginaService.save(formData);
    if (result.type === "SUCCESS") {
      setDescripcion("");
      setTema("");
      setTitulo("");
      setSubtitulo("");
      event.options.clear();
      util.success(toast, "Se ha guardado correctamente el registro");
      await find();
    } else
      util.error(toast, "Ha ocurrido un error al tratar de subir el registro");
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={deleteDialog}
        onHide={(e) => setDeleteDialog(false)}
        showHeader={false}
      >
        <>
          <div className="row">
            <div className="col s12">
              ¿Esta seguro que desea eliminar este registro?
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={closeDeleteDialog}
              >
                Si
              </button>
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={(e) => setDeleteDialog(false)}
                style={{ marginLeft: " 15px " }}
              >
                No
              </button>
            </div>
          </div>
        </>
      </Dialog>
      <Dialog
        visible={imageDialog}
        onHide={(e) => setImageDialog(false)}
        header="Ver imagenes"
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <Galleria
          value={fotos}
          responsiveOptions={responsiveOptions}
          numVisible={5}
          style={{ maxWidth: "640px" }}
          item={itemTemplate}
          showThumbnails={false}
          showIndicators
        />
      </Dialog>
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Diseño de Pagina</h4>
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
            <div
              className="col s12"
              style={{ fontSize: "16px", lineHeight: "29px" }}
            >
              Complete el formulario para actualizar una de las secciones del
              ecommerce, para definir la sección, debe seleccionarla en el
              primer campo, agregar la descripción que se desea y luego las
              imágenes que esta tendrá.
            </div>
          </div>
          <div className="row">
            <div className="col s12 input-field">
              <Dropdown
                value={tema}
                options={temasList}
                onChange={(e) => setTema(e.value)}
                style={{ width: "100%" }}
                placeholder="Debe seleccionar una sección"
              />
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
              <label htmlFor="titulo">Ingrese el titulo:</label>
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
              <label htmlFor="subtitulo">Ingrese el subtitulo:</label>
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
            <div className="col s12 right-align">
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={saveNoImages}
              >
                Guardar sin imágenes
              </button>
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={find}
                style={{ marginLeft: "20px" }}
              >
                Buscar
              </button>
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
          <div className="row">
            <div className="col s12">{loading && <Loading />}</div>
          </div>
        </div>
      </div>
      <div className="row card">
        <div className="col s12">
          <DataTable
            value={list}
            loading={loading}
            stripedRows
            emptyMessage="No hay registro(s)"
          >
            <Column
              field="tema"
              header="Secci&oacute;n"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="titulo"
              header="Titulo"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="subtitulo"
              header="Subtitulo"
              sortable
              filter
              filterMatchMode="contains"
            />
            <Column
              field="descripcion"
              header="Descripci&oacute;n"
              body={descBodyTemplate}
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

export default PaginaForm;
