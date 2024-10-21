import React, { useState, useEffect, useRef } from "react";
import authService from "../../service/common/authService";
import ProductoService from "../../service/modules/productoService";
import DescuentoService from "../../service/modules/descuentoService";
import CategoriaService from "../../service/modules/categoriaService";
import util from "../../service/common/util";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

const DescuentoMasivo = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [catPadres, setCatPadres] = useState([]);
  const [catHijas, setCatHijas] = useState([]);
  const [list, setList] = useState([]);
  const [listFull, setListFull] = useState([]);
  const [catPadreValue, setCatPadreValue] = useState("");
  const [catHijaValue, setCatHijaValue] = useState("");
  const [catHijaOptions, setCatHijaOptions] = useState([]);
  const [etiqueta, setEtiqueta] = useState("");
  const [descuento, setDescuento] = useState("");
  const [descDialog, setDescDialog] = useState(false);
  const [user, setUser] = useState(authService.getUser());

  const find = async () => {
    const list = await ProductoService.findSinDescuento();
    setList(list);
    setListFull(list);
  };

  useEffect(async () => {
    setLoading(true);
    try {
      const catPadres = await CategoriaService.findPadres();
      const catHijas = await CategoriaService.findHijas();
      setCatPadres(catPadres);
      setCatHijas(catHijas);
      await find();
    } catch (e) {
      console.log(e);
      util.error(toast, "Ha ocurrido un error al cargar la informacion");
    }
    setLoading(false);
  }, []);

  const items = [{ label: "Descuentos" }, { label: "Aplicar Descuento" }];

  const onChangeCatPadre = (value) => {
    setCatPadreValue(value);
    const catHijaModel = catHijas.filter(
      (cp) => cp.padre && cp.padre._id && cp.padre._id === value
    );
    setCatHijaOptions(catHijaModel);
  };

  const filterProductos = () => {
    if (!catPadreValue || !catHijaValue)
      util.warning(toast, "Debe seleccionar la categoria padre e hija");
    else {
      setLoading(true);
      let newList = listFull;
      if (catPadreValue)
        newList = newList.filter((e) => e.categoria === catPadreValue);
      if (catHijaValue)
        newList = newList.filter((e) => e.categoriaHija === catHijaValue);
      if (etiqueta)
        newList = newList.filter((e) => {
          if (e.etiqueta && e.etiqueta.length > 0) {
            const model = e.etiqueta.find((m) => {
              return m.toLowerCase().trim() === etiqueta.toLowerCase().trim();
            });

            if (model) return e.etiqueta.includes(model);
          }
        });
      setList(newList);
      setLoading(false);
    }
  };

  const descuentoBodyTemplate = (rowData) => {
    const newPrice = ProductoService.generateDescuento(
      rowData.monto,
      descuento
    );
    return (
      <span style={{ fontWeight: "bold", color: "#b41e33", fontSize: "16px" }}>
        {newPrice}
      </span>
    );
  };

  const validateDescuento = () => {
    if (descuento && catPadreValue && catHijaValue) setDescDialog(true);
    else
      util.warning(
        toast,
        "Debe llenar todos los campos para generar un descuento"
      );
  };

  const executeDescuento = async () => {
    const result = await DescuentoService.save(
      list,
      user,
      etiqueta,
      descuento,
      catPadreValue,
      catHijaValue
    );
    if (result.type === "SUCCESS") {
      util.success(toast, "Se ha generado el descuento correctamente");
      await find();
    } else
      util.error(
        toast,
        "Ha ocurrido un error al tratar de generar el descuento"
      );
    setDescDialog(false);
  };

  return (
    <>
      <Dialog
        visible={descDialog}
        onHide={(e) => setDescDialog(false)}
        showHeader={false}
      >
        <div className="row" style={{ marginTop: "10px" }}>
          <div className="col s12">
            ¿Esta seguro que deseas aplicar el {descuento}% a los productos que
            aparecen en pantalla?
          </div>
        </div>
        <div className="row right-align" style={{ marginBottom: "0px" }}>
          <div className="col s12">
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={executeDescuento}
            >
              Si
            </button>
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={(e) => setDescDialog(false)}
              style={{ marginLeft: "15px" }}
            >
              No
            </button>
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Aplicar Descuentos</h4>
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
              Estos son los productos activos en el sistema, dejame ayudarte a
              aplicarles un descuento de forma masiva, para hacerlo puedes
              filtrar la informacion segun creas conveniente y luego definir el
              porcentaje de descuento que deseas aplicar:
            </div>
          </div>
          <div className="row">
            <div className="col s12 m12 l6">
              <Dropdown
                value={catPadreValue}
                options={catPadres}
                optionValue="_id"
                optionLabel="nombre"
                style={{ width: "100%" }}
                showClear
                placeholder="Puedes seleccionar una categoria padre"
                onChange={(e) => onChangeCatPadre(e.value)}
              />
            </div>
            <div className="col s12 m12 l6">
              <Dropdown
                value={catHijaValue}
                options={catHijaOptions}
                optionValue="_id"
                optionLabel="nombre"
                placeholder="Puedes seleccionar una categoria hija"
                onChange={(e) => setCatHijaValue(e.value)}
                style={{ width: "100%" }}
                showClear
                emptyMessage="Debes seleccionar primero la categoria padre"
              />
            </div>
          </div>
          <div className="row">
            {/*<div className="col s12 m12 l6 input-field">
              <i className="material-icons prefix">bookmark</i>
              <input
                type="text"
                value={etiqueta}
                placeholder="Ingresa la etiqueta que deseas buscar"
                onChange={(e) => setEtiqueta(e.target.value)}
              />
            </div>*/}
            <div className="col s12 m12 l6 input-field">
              <i className="material-icons prefix">percent</i>
              <input
                type="number"
                value={descuento}
                placeholder="Ingrese el descuento, debe ser un numero de 1 a 100"
                onChange={(e) => setDescuento(e.target.value)}
              />
            </div>
            <div className="col s12 m12 l6 input-field right-align">
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={filterProductos}
              >
                Filtrar los datos
              </button>
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={validateDescuento}
                style={{ marginLeft: "15px" }}
              >
                Agregar descuento
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              <DataTable
                value={list}
                loading={loading}
                stripedRows
                emptyMessage="No hay registro(s)"
                sortField="categoriaNombre"
                sortOrder={1}
              >
                <Column field="categoriaNombre" header="Categoria Padre" />
                <Column field="categoriaHijaNombre" header="Categoria Hija" />
                <Column field="nombre" header="Nombre" />
                <Column
                  field="etiqueta"
                  header="Etiquetas"
                  body={ProductoService.etiquetaBodyTemplate}
                />
                <Column field="monto" header="Precio" />
                <Column
                  header="NUEVO PRECIO"
                  body={descuentoBodyTemplate}
                  style={{ textAlign: "center" }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DescuentoMasivo;
