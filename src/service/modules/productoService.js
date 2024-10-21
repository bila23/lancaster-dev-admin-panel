import http from "../common/httpService";
import util from "../common/util";
import _ from "lodash";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const api = "/producto";

const posiciones = ["FRO", "TRA", "IZQ", "DER", "ARR", "ABA"];

async function updateFotos(id, files) {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  let formData = new FormData();
  let file;
  for (let i = 0; i < files.length; i++) {
    file = files[i];
    formData.append(`file${i}`, file);
  }
  const { data: result } = await http.post(
    `${api}/update/fotos/${id}`,
    formData,
    config
  );
  return result;
}

function generateDescuento(monto, descuento) {
  let newPrice = 0.0;
  if (descuento)
    newPrice = util.formatNumber(monto - (monto * descuento) / 100);
  return newPrice;
}

async function findSinDescuento() {
  const { data: result } = await http.get(`${api}/sin/descuento`);
  return result;
}

async function findByEstado(estado) {
  const { data: result } = await http.get(`${api}/estado/${estado}`);
  return result;
}

function prepareData(list) {
  let lst = [];
  for (const model of list) {
    lst.push({
      ...model,
      colorCodigo: model.color.split("-")[0],
      colorNombre: model.color.split("-")[1],
    });
  }
  return lst;
}

function prepareDataToExcel(list) {
  let lst = [];
  for (const model of list) {
    lst.push({
      categoriaPadre: model.categoriaNombre,
      categoriaHija: model.categoriaHijaNombre,
      codigo: model.codigo,
      nombre: model.nombre,
      talla: model.talla,
      color: model.color,
      calidad: model.calidad,
      especificaciones: model.especificaciones,
      etiqueta: etiquetaToString(model.etiqueta),
      cantidad: model.cantidad,
      precio: model.monto,
      codigoCompleto: model.codigoCompleto,
      sunat: model.sunat,
      id: model.id,
    });
  }
  return lst;
}

function etiquetaToString(etiqueta) {
  let result = "";
  if (!etiqueta || etiqueta.length === 0) return result;
  let size = etiqueta.length;
  for (const model of etiqueta) {
    if (size === 1) result = result + model;
    else result = result + model + ",";
    size = size - 1;
  }
  return result;
}

const etiquetaBodyTemplate = (rowData) => {
  const etiqueta = etiquetaToString(rowData.etiqueta);
  return <>{etiqueta}</>;
};

async function allUpdates(model) {
  const { data: result } = await http.post(`${api}/all/update`, model);
  return result;
}

async function updateOnlyInfo(model) {
  const { data: result } = await http.put(
    `${api}/only/info/${model._id}`,
    model
  );
  return result;
}

async function deleteFoto(id, idFoto) {
  const { data: result } = await http.delete(`${api}/foto/${id}/${idFoto}`);
  return result;
}

async function findOnlyById(id) {
  const { data: producto } = await http.get(`${api}/only/${id}`);
  return producto;
}

async function findById(id) {
  const { data: producto } = await http.get(`${api}/${id}`);
  return producto;
}

function validateFilename(filename) {
  if (!filename)
    return {
      type: "ERROR",
      msg: <span className="red">El archivo viene vacio</span>,
    };
  if (typeof filename !== "string")
    return {
      type: "ERROR",
      msg: (
        <span style={{ color: "red" }}>
          El formato del nombre del archivo es incorrecto
        </span>
      ),
    };
  if (!filename.includes("_"))
    return {
      type: "ERROR",
      msg: (
        <span style={{ color: "red" }}>
          El formato del nombre del archivo es incorrecto
        </span>
      ),
    };
  const array = filename.split("_");
  if (array.length !== 3)
    return {
      type: "ERROR",
      msg: (
        <span style={{ color: "red" }}>
          El formato del nombre del archivo es incorrecto
        </span>
      ),
    };

  if (_.isNaN(array[1]))
    return {
      type: "ERROR",
      msg: (
        <span style={{ color: "red" }}>
          El valor relacionado al orden de la imagen debe ser un numero
        </span>
      ),
    };

  if (posiciones.includes(array[2].toUpperCase()))
    return {
      type: "ERROR",
      msg: (
        <span style={{ color: "red" }}>
          El valor de la posicion de la imagen es incorrecto
        </span>
      ),
    };

  return {
    type: "SUCCESS",
    array: array,
    msg: <span style={{ color: "green" }}>Archivo valido</span>,
  };
}

async function findByCodigo(codigo) {
  const { data: model } = await http.get(`${api}/codigo/${codigo}`);
  return model;
}

async function updateInfo(model) {
  const { data: result } = await http.put(`${api}/info/${model._id}`, model);
  return result;
}

async function update(model, files) {
  let formData = new FormData();
  let valid;
  for (const [key, value] of Object.entries(model)) formData.append(key, value);
  for (let i = 0; i < files.length; i++) {
    valid = validateFilename(files[i].name);
    if (valid.type === "SUCCESS") formData.append(`file${i}`, files[i]);
  }
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const { data: result } = await http.put(
    `${api}/${model._id}`,
    formData,
    config
  );
  return result;
}

async function findDistinctCode() {
  const { data: result } = await http.get(`${api}/distinct/code`);
  let list = [];
  for (const model of result) list.push({ label: model, value: model });
  return list;
}

async function findAll() {
  const { data: result } = await http.get(api);
  return result;
}

async function findAllEstado() {
  const { data: result } = await http.get(api);
  const activos = _.filter(result, { estado: "ACTIVO" });
  const inactivos = _.filter(result, { estado: "INACTIVO" });
  const sinFotos = _.filter(result, { estado: "SIN FOTOS" });
  return { activos: activos, inactivos: inactivos, sinFotos: sinFotos };
}

async function changeEstado(id, estado) {
  const body = { estado: estado };
  const { data: result } = await http.put(`${api}/estado/${id}`, body);
  return result;
}

async function saveMany(formData, user) {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const { data: result } = await http.post(
    `${api}/masivo/${user}`,
    formData,
    config
  );
  return result;
}

async function save(model, files) {
  let formData = new FormData();
  let valid;
  for (const [key, value] of Object.entries(model)) formData.append(key, value);
  for (let i = 0; i < files.length; i++) {
    valid = validateFilename(files[i].name);
    if (valid.type === "SUCCESS") formData.append(`file${i}`, files[i]);
  }
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const { data: result } = await http.post(api, formData, config);
  return result;
}

const tallaOptions = [
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
];

const colorOptions = [
  { label: "Amarillo", value: "#FFFF00-Amarillo" },
  { label: "Anaranjado", value: "#FF8000-Anaranjado" },
  { label: "Azul", value: "#000099-Azul" },
  { label: "Blanco", value: "#FFFFFF-Blanco" },
  { label: "Cafe", value: "#A52A2A-Cafe" },
  { label: "Gris", value: "#808080-Gris" },
  { label: "Morado", value: "#800080-Morado" },
  { label: "Negro", value: "#000000-Negro" },
  { label: "Rojo", value: "#FF0000-Rojo" },
  { label: "Rosado", value: "#FFC0CB-Rosado" },
  { label: "Verde", value: "#008000-Verde" },
];

function validateForm(form, setErrors) {
  let flag = true;
  let errorForm = {};
  if (!form.categoriaFull) {
    errorForm.categoriaFull = "Debe ingresar la categoria padre";
    flag = false;
  }
  if (!form.categoriaHijaFull) {
    errorForm.categoriaHijaFull = "Debe ingresar la categoria hija";
    flag = false;
  }
  if (!form.codigo) {
    errorForm.codigo = "Debe ingresar el codigo";
    flag = false;
  }
  if (!form.nombre) {
    errorForm.nombre = "Debe ingresar el nombre";
    flag = false;
  }
  if (!form.cantidad) {
    errorForm.cantidad = "Debe ingresar la cantidad";
    flag = false;
  }
  if (!form.monto) {
    errorForm.monto = "Debe ingresar el monto";
    flag = false;
  }
  if (!form.talla) {
    errorForm.talla = "Debe ingresar la talla";
    flag = false;
  }
  if (!form.color) {
    errorForm.color = "Debe ingresar el color";
    flag = false;
  }
  if (!form.calidad) {
    errorForm.calidad = "Debe ingresar la calidad";
    flag = false;
  }
  if (!form.especificaciones) {
    errorForm.especificaciones = "Debe ingresar las especificaciones ";
    flag = false;
  }
  /*if (!form.etiqueta || form.etiqueta.length === 0) {
    errorForm.etiqueta = "Debe ingresar las etiquetas ";
    flag = false;
  }*/
  setErrors(errorForm);
  return flag;
}

const itemImageTemplate = (file, props) => {
  const { msg } = validateFilename(file.name);
  return (
    <div className="row" style={{ marginBottom: "0px" }}>
      <div className="col s12 m6 left-align">
        <i
          className="material-icons left"
          style={{ color: "#D32F2F", fontSize: "28px" }}
        >
          image
        </i>
        {file.name}: {msg}
      </div>
      <div className="col s12 m6 right-align">
        <Tag
          value={props.formatSize}
          severity="warning"
          style={{ marginRight: "10px", fontSize: "0.79rem" }}
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger p-ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    </div>
  );
};

const itemTemplate = (file, props) => {
  return (
    <div className="row" style={{ marginBottom: "0px" }}>
      <div className="col s12 m6 left-align">
        <i
          className="material-icons left"
          style={{ color: "#D32F2F", fontSize: "28px" }}
        >
          article
        </i>
        {file.name}
      </div>
      <div className="col s12 m6 right-align">
        <Tag
          value={props.formatSize}
          severity="warning"
          style={{ marginRight: "10px", fontSize: "0.79rem" }}
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger p-ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    </div>
  );
};

const onTemplateRemove = (file, callback) => {
  callback();
};

export default {
  tallaOptions,
  colorOptions,
  validateForm,
  save,
  findAll,
  findDistinctCode,
  changeEstado,
  update,
  findByCodigo,
  findAllEstado,
  validateFilename,
  itemImageTemplate,
  findById,
  deleteFoto,
  itemTemplate,
  updateInfo,
  saveMany,
  updateOnlyInfo,
  allUpdates,
  prepareDataToExcel,
  prepareData,
  findByEstado,
  etiquetaBodyTemplate,
  generateDescuento,
  findSinDescuento,
  findOnlyById,
  updateFotos,
};
