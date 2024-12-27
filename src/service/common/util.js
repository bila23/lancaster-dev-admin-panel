import React from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const handleFormChange = (id, value, setForm) => {
  setForm((prevForm) => ({ ...prevForm, [id]: value }));
};

const ESTADO_OPTIONS = [
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
];

const chooseTextOptions = {
  className: "custom-choose-btn p-button-rounded p-button-outlined",
  label: "Seleccionar archivos",
};
const uploadTextOptions = {
  className:
    "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  label: "Subir archivos",
};
const uploadProductoOptions = {
  className:
    "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  label: "Subir Producto",
};
const cancelTextOptions = {
  className:
    "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  label: "Cancelar",
};

const onTemplateRemove = (file, callback) => {
  callback();
};

function validatePDFFile(filename) {
  return filename.toLowerCase().includes(".pdf");
}

function validateImageFile(filename) {
  return (
    filename.toLowerCase().includes(".jpg") ||
    filename.toLowerCase().includes(".jpeg") ||
    filename.toLowerCase().includes(".png") ||
    filename.toLowerCase().includes(".webp") ||
    filename.toLowerCase().includes(".jfif") ||
    filename.toLowerCase().includes(".bmp")
  );
}

function displayPDFValidateFile(filename) {
  const flag = validatePDFFile(filename);
  return flag ? (
    <span style={{ fontWeight: "bold", color: "green" }}>Archivo valido</span>
  ) : (
    <span style={{ fontWeight: "bold", color: "red" }}>Archivo no valido</span>
  );
}

function displayImageValidateFile(filename) {
  const flag = validateImageFile(filename);
  return flag ? (
    <span style={{ fontWeight: "bold", color: "green" }}>Archivo valido</span>
  ) : (
    <span style={{ fontWeight: "bold", color: "red" }}>Archivo no valido</span>
  );
}

const itemImageTemplate = (file, props) => {
  const name = displayImageValidateFile(file.name);
  return (
    <div className="row" style={{ marginBottom: "0px" }}>
      <div className="col s12 m6 left-align">
        <i
          className="material-icons left"
          style={{ color: "#D32F2F", fontSize: "28px" }}
        >
          image
        </i>
        {file.name}: {name}
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

const itemImageNoMsgTemplate = (file, props) => {
  return (
    <div className="row" style={{ marginBottom: "0px" }}>
      <div className="col s12 m6 left-align">
        <i
          className="material-icons left"
          style={{ color: "#D32F2F", fontSize: "28px" }}
        >
          image
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

const itemPdfTemplate = (file, props) => {
  const name = displayPDFValidateFile(file.name);
  return (
    <div className="p-d-flex p-ai-center p-flex-wrap">
      <div className="p-d-flex p-ai-center" style={{ width: "80%" }}>
        <i
          className="pi pi-file-pdf"
          style={{ color: "#D32F2F", fontSize: "28px" }}
        ></i>
        <span className="p-d-flex p-dir-col p-text-left p-ml-3">
          {file.name}:
        </span>
        <span style={{ marginLeft: "10px" }}>{name}</span>
      </div>
      <Tag
        value={props.formatSize}
        severity="warning"
        className="p-px-3 p-py-2"
      />
      <Button
        type="button"
        icon="pi pi-times"
        className="p-button-outlined p-button-rounded p-button-danger p-ml-auto"
        onClick={() => onTemplateRemove(file, props.onRemove)}
      />
    </div>
  );
};

const emptyImageTemplate = () => {
  return (
    <div className="center p-d-flex p-ai-center p-dir-col">
      <i
        className="pi pi-image p-mt-3 p-p-5"
        style={{
          fontSize: "5em",
          borderRadius: "50%",
          backgroundColor: "var(--surface-b)",
          color: "var(--surface-d)",
        }}
      ></i>
      <div
        style={{
          fontSize: "1.2em",
          color: "var(--text-color-secondary)",
        }}
        className="p-my-5"
      >
        Arrastre o seleccione los archivos
      </div>
    </div>
  );
};

const emptyPDFTemplate = () => {
  return (
    <div className="p-d-flex p-ai-center p-dir-col">
      <i
        className="pi pi-file-pdf p-mt-3 p-p-5"
        style={{
          fontSize: "5em",
          borderRadius: "50%",
          backgroundColor: "var(--surface-b)",
          color: "var(--surface-d)",
        }}
      ></i>
      <span
        style={{
          fontSize: "1.2em",
          color: "var(--text-color-secondary)",
        }}
        className="p-my-5"
      >
        Arrastre o seleccione los archivos
      </span>
    </div>
  );
};

const chooseOptions = {
  icon: "pi pi-fw pi-file-excel",
  iconOnly: true,
  className: "custom-choose-btn p-button-rounded p-button-outlined",
};
const uploadOptions = {
  icon: "pi pi-fw pi-cloud-upload",
  iconOnly: true,
  className:
    "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
};
const cancelOptions = {
  icon: "pi pi-fw pi-times",
  iconOnly: true,
  className:
    "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
};

const itemTemplate = (file, props) => {
  return (
    <div className="p-d-flex p-ai-center p-flex-wrap">
      <div className="p-d-flex p-ai-center" style={{ width: "40%" }}>
        <i
          className="pi pi-file-excel"
          style={{ color: "green", fontSize: "28px" }}
        ></i>
        <span className="p-d-flex p-dir-col p-text-left p-ml-3">
          {file.name}
        </span>
      </div>
      <Tag
        value={props.formatSize}
        severity="warning"
        className="p-px-3 p-py-2"
      />
      <Button
        type="button"
        icon="pi pi-times"
        className="p-button-outlined p-button-rounded p-button-danger p-ml-auto"
        onClick={() => onTemplateRemove(file, props.onRemove)}
      />
    </div>
  );
};

const emptyTemplateExcel = () => {
  return (
    <div className="p-d-flex p-ai-center p-dir-col">
      <i
        className="pi pi-file-excel p-mt-3 p-p-5"
        style={{
          fontSize: "5em",
          borderRadius: "50%",
          backgroundColor: "var(--surface-b)",
          color: "var(--surface-d)",
        }}
      ></i>
      <span
        style={{
          fontSize: "1.2em",
          color: "var(--text-color-secondary)",
        }}
        className="p-my-5"
      >
        Arrastre o seleccione los archivos
      </span>
    </div>
  );
};

const headerTemplateExcel = (options) => {
  const { className, chooseButton, uploadButton, cancelButton } = options;

  return (
    <div
      className={className}
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      {chooseButton}
      {uploadButton}
      {cancelButton}
      <div style={{ marginLeft: "auto", fontWeight: "bold" }}>
        Valido solo archivos de Excel
      </div>
    </div>
  );
};

const handleChange = (event, form, setForm) => {
  const { name, value } = event.target;
  setForm({ ...form, [name]: value });
};

const handleChangeValue = (event, form, setForm) => {
  const { name } = event.target;
  setForm({ ...form, [name]: event.value });
};

const calendarSpanish = {
  firstDayOfWeek: 1,
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  today: "Hoy",
  clear: "Limpiar",
};

const numberTemplate = (data, props) => {
  const numberValue = data[props.field];
  let number;
  if (isNaN(numberValue) || !numberValue) number = "0.00";
  else {
    number = formatNumber(numberValue);
    if (number === "-0.00") number = "0.00";
  }
  return <React.Fragment>{number}</React.Fragment>;
};

const porcentajeTemplate = (data, props) => {
  const number = data[props.field];
  if (isNaN(number) || !number)
    return <React.Fragment>{"0.00%"}</React.Fragment>;
  const valor = parseFloat(number) * 100;
  return <React.Fragment>{valor.toFixed(2)}%</React.Fragment>;
};

export function confirm(id, onDelete) {
  confirmDialog({
    message: "¿Esta seguro que desea eliminar este registro?",
    header: "Confirmación",
    icon: "pi pi-exclamation-triangle",
    accept: () => onDelete(id),
  });
}

export const success = (toast, message) => {
  toast.current.show({
    severity: "success",
    summary: "Exito",
    detail: message,
    life: 6000,
  });
};

export const info = (toast, message) => {
  toast.current.show({
    severity: "info",
    summary: "Información",
    detail: message,
    life: 6000,
  });
};

export const error = (toast, message) => {
  toast.current.show({
    severity: "error",
    summary: "Error",
    detail: message,
    life: 6000,
  });
};

export const warning = (toast, message) => {
  toast.current.show({
    severity: "warn",
    summary: "Advertencia",
    detail: message,
    life: 6000,
  });
};

export const saveAsExcelFile = (buffer, fileName) => {
  import("file-saver").then((FileSaver) => {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  });
};

export const exportExcel = (list, fileName) => {
  import("xlsx").then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(list);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, fileName);
  });
};

export const monthList = () => {
  let list = [];
  list.push({ nombre: "Seleccione un mes", _id: 0 });
  list.push({ nombre: "Enero", _id: 1 });
  list.push({ nombre: "Febrero", _id: 2 });
  list.push({ nombre: "Marzo", _id: 3 });
  list.push({ nombre: "Abril", _id: 4 });
  list.push({ nombre: "Mayo", _id: 5 });
  list.push({ nombre: "Junio", _id: 6 });
  list.push({ nombre: "Julio", _id: 7 });
  list.push({ nombre: "Agosto", _id: 8 });
  list.push({ nombre: "Septiembre", _id: 9 });
  list.push({ nombre: "Octubre", _id: 10 });
  list.push({ nombre: "Noviembre", _id: 11 });
  list.push({ nombre: "Diciembre", _id: 12 });
  return list;
};

function formatNumber(
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

const monthItems = [
  { label: "Enero", value: 1 },
  { label: "Febrero", value: 2 },
  { label: "Marzo", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Mayo", value: 5 },
  { label: "Junio", value: 6 },
  { label: "Julio", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre", value: 10 },
  { label: "Noviembre", value: 11 },
  { label: "Diciembre", value: 12 },
];

function getMonthText(month) {
  const monthNumber = parseInt(month);
  const result = monthItems.find((element) => element.value === monthNumber);
  return result.label;
}

function validateEmail(emailAdress) {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) return true;
  else return false;
}

const headerImageTemplate = (options) => {
  const { className, chooseButton, uploadButton, cancelButton } = options;

  return (
    <div
      className={className}
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      {chooseButton}
      {uploadButton}
      {cancelButton}
    </div>
  );
};

const imageTemplate = (item) => {
  //return <img src={`data:${item.img.contentType};base64,${item.img.data}`} />;
  return <img src={`${item.url}`} />;
};

const activoBody = ({ activo }) => {
  return <>{activo ? "Si" : "No"}</>;
};

const home = {
  icon: "pi pi-home",
  url: "/",
};

export default {
  home,
  activoBody,
  headerImageTemplate,
  numberTemplate,
  porcentajeTemplate,
  confirm,
  exportExcel,
  saveAsExcelFile,
  warning,
  info,
  error,
  success,
  monthList,
  calendarSpanish,
  handleChange,
  formatNumber,
  emptyTemplateExcel,
  headerTemplateExcel,
  itemTemplate,
  chooseOptions,
  uploadOptions,
  cancelOptions,
  monthItems,
  getMonthText,
  validateEmail,
  emptyPDFTemplate,
  itemPdfTemplate,
  validatePDFFile,
  chooseTextOptions,
  uploadTextOptions,
  cancelTextOptions,
  handleChangeValue,
  itemImageTemplate,
  emptyImageTemplate,
  uploadProductoOptions,
  validateImageFile,
  imageTemplate,
  itemImageNoMsgTemplate,
  ESTADO_OPTIONS,
  handleFormChange,
};
