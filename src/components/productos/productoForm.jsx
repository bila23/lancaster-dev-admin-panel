import React, { useState, useEffect, useRef } from "react";
import Input from "../common/input";
import util from "../../service/common/util";
import authService from "../../service/common/authService";
import ProductoService from "../../service/modules/productoService";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { Chips } from "primereact/chips";
import { FileUpload } from "primereact/fileupload";

const ProductoForm = (props) => {
  const {
    form,
    setForm,
    errors,
    uploadFiles,
    codes,
    setCodes,
    disabled,
    setDisabled,
    activateLabel,
    showImages,
    catPadres,
    catHijas,
  } = props;

  const [labelClass, setLabelClass] = useState("");
  const fileUploadRef = useRef(null);

  async function findCodes() {
    const codes = await ProductoService.findDistinctCode();
    setCodes(codes);
  }

  useEffect(async () => {
    await findCodes();
    if (activateLabel) setLabelClass("active");
  }, []);

  const changeCodigo = async (event, form, setForm) => {
    const value = event.value;
    const model = await ProductoService.findByCodigo(value);
    let initialForm;
    if (model) {
      setLabelClass("active");
      setDisabled(true);
      initialForm = {
        categoria: model.categoria,
        categoriaNombre: model.categoriaNombre,
        categoriaHija: model.categoriaHija,
        categoriaHijaNombre: model.categoriaHijaNombre,
        categoriaFull: model.categoriaFull,
        categoriaHijaFull: model.categoriaHijaFull,
        codigo: model.codigo,
        nombre: model.nombre,
        monto: model.monto,
        talla: form.talla,
        color: form.color,
        calidad: model.calidad,
        cantidad: form.cantidad,
        especificaciones: model.especificaciones,
        estado: "ACTIVO",
        etiqueta: model.etiqueta,
        usuarioCrea: authService.getUser(),
      };
    } else {
      setLabelClass("");
      setDisabled(false);
      initialForm = {
        categoria: "",
        categoriaNombre: "",
        categoriaHija: "",
        categoriaFull: "",
        categoriaHijaFull: "",
        categoriaHijaNombre: "",
        codigo: value,
        nombre: "",
        monto: "",
        talla: "",
        color: "",
        calidad: "",
        cantidad: "",
        especificaciones: "",
        estado: "ACTIVO",
        etiqueta: "",
        usuarioCrea: authService.getUser(),
      };
    }
    setForm(initialForm);
  };

  const categoriaChange = (event, form, setForm) => {
    const value = event.value;
    const split = value.split("-");
    setForm({
      ...form,
      categoriaFull: value,
      categoria: split[0],
      categoriaNombre: split[1],
    });
  };

  const categoriaHijaChange = (event, form, setForm) => {
    const value = event.value;
    const split = value.split("-");
    setForm({
      ...form,
      categoriaHija: split[0],
      categoriaHijaFull: value,
      categoriaHijaNombre: split[1],
    });
  };

  return (
    <>
      <div className="row">
        <div className="col s12 m9 input-field">
          <Dropdown
            value={form.codigo}
            options={codes}
            editable
            name="codigo"
            style={{ width: "100%", border: "0px solid" }}
            inputId="codigo"
            id="codigo-drop"
            filter
            filterBy="label"
            emptyFilterMessage="No se encontró el código"
            virtualScrollerOptions={{ itemSize: 38 }}
            emptyMessage="No hay códigos registrados"
            placeholder="Código del producto:"
            onChange={(e) => changeCodigo(e, form, setForm)}
          />
          {errors["codigo"] && (
            <div className="danger-alert alert">{errors["codigo"]}</div>
          )}
        </div>
        <div className="col s1 m3">
          <div>Calidad del producto:</div>
          <Rating
            value={form.calidad}
            name="calidad"
            id="calidad"
            cancel={false}
            disabled={disabled}
            onChange={(e) => util.handleChangeValue(e, form, setForm)}
          />
          {errors["calidad"] && (
            <div className="danger-alert alert">{errors["calidad"]}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Dropdown
            value={form.categoriaFull}
            options={catPadres}
            name="categoriaFull"
            inputId="categoriaFull"
            id="categoriaFull"
            disabled={disabled}
            style={{ width: "100%" }}
            placeholder="Seleccione la categoria padre"
            onChange={(e) => categoriaChange(e, form, setForm)}
          />
          {errors["categoriaFull"] && (
            <div className="danger-alert alert">{errors["categoriaFull"]}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Dropdown
            value={form.categoriaHijaFull}
            options={catHijas}
            name="categoriaHijaFull"
            id="categoriaHijaFull"
            disabled={disabled}
            style={{ width: "100%" }}
            placeholder="Seleccione la categoria hija"
            onChange={(e) => categoriaHijaChange(e, form, setForm)}
          />
          {errors["categoriaHijaFull"] && (
            <div className="danger-alert alert">
              {errors["categoriaHijaFull"]}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="nombre"
            value={form.nombre}
            className="validate"
            disabled={disabled}
            type="text"
            label="Nombre del producto:"
            name="nombre"
            labelClass={labelClass}
            error={errors["nombre"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="codigoCompleto"
            value={form.codigoCompleto}
            className="validate"
            disabled={disabled}
            type="text"
            label="Código completo del producto:"
            name="codigoCompleto"
            labelClass={labelClass}
            error={errors["codigoCompleto"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="sunat"
            value={form.sunat}
            className="validate"
            disabled={disabled}
            type="text"
            label="Sunat:"
            name="sunat"
            labelClass={labelClass}
            error={errors["sunat"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="monto"
            value={form.monto}
            type="number"
            disabled={disabled}
            label="Valor del producto ($):"
            name="monto"
            labelClass={labelClass}
            error={errors["monto"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="cantidad"
            value={form.cantidad}
            className="validate"
            type="number"
            label="Cantidad en stock:"
            name="cantidad"
            labelClass={labelClass}
            error={errors["cantidad"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="talla"
            value={form.talla}
            className="validate"
            type="text"
            disabled={disabled}
            labelClass={labelClass}
            label="Talla del producto:"
            name="talla"
            error={errors["talla"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="color"
            value={form.color}
            className="validate"
            type="text"
            disabled={disabled}
            labelClass={labelClass}
            label="Color del producto:"
            name="color"
            error={errors["color"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Input
            id="especificaciones"
            value={form.especificaciones}
            className="validate"
            type="text"
            disabled={disabled}
            labelClass={labelClass}
            label="Especificaciones del producto:"
            name="especificaciones"
            error={errors["especificaciones"]}
            onChange={(e) => util.handleChange(e, form, setForm)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <span>
            Ingrese las etiquetas, presione la tecla Enter cuando ingrese una
          </span>
          <Chips
            value={form.etiqueta}
            name="etiqueta"
            onChange={(e) => util.handleChangeValue(e, form, setForm)}
            separator=","
            style={{ width: "100%" }}
            disabled={disabled}
            inputId="etiqueta"
          />
          {errors["etiqueta"] && (
            <div className="danger-alert alert">{errors["etiqueta"]}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          {showImages && (
            <FileUpload
              ref={fileUploadRef}
              name="file"
              id="file"
              customUpload
              uploadHandler={uploadFiles}
              multiple
              accept="image/*"
              headerTemplate={util.headerImageTemplate}
              itemTemplate={ProductoService.itemImageTemplate}
              emptyTemplate={util.emptyImageTemplate}
              chooseOptions={util.chooseTextOptions}
              uploadOptions={util.uploadProductoOptions}
              cancelOptions={util.cancelTextOptions}
            />
          )}
          {!showImages && (
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={uploadFiles}
            >
              Actualizar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductoForm;
