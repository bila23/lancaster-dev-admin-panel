import React, { useState, useEffect } from "react";
import authService from "../../service/common/authService";
import service from "../../service/modules/categoriaService";
import util from "../../service/common/util";
import Btn from "../common/btn";
import { Dropdown } from "primereact/dropdown";

const CategoriaSave = ({ find, toast, mode, model }) => {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [activo, setActivo] = useState(true);
  const [padre, setPadre] = useState("");
  const [editClass, setEditClass] = useState("");
  const [padreList, setPadreList] = useState([]);

  const init = async () => {
    const padreData = await service.findPadres();
    setPadreList(padreData);
    if (mode === "UPDATE") fillForm();
  };

  const fillForm = () => {
    setEditClass("active");
    setNombre(model.nombre);
    setCodigo(model.codigo);
    setActivo(model.activo);
    if (model.padre) setPadre(model.padre._id);
  };

  useEffect(() => {
    init();
  }, []);

  const validateForm = () => {
    if (!codigo) {
      util.warning(toast, "Debe ingresar el codigo");
      return false;
    } else if (!nombre) {
      util.warning(toast, "Debe ingresar el nombre");
      return false;
    } else return true;
  };

  const doSave = async () => {
    if (validateForm()) {
      const nivel = padre ? 1 : 0;
      const usuarioCrea = authService.getUser();
      const body = { nombre, codigo, activo, padre, nivel, usuarioCrea };
      const { type, message } = await service.save(body);
      if (type !== "SUCCESS") util.warning(toast, message);
      else {
        util.success(toast, "Se ha guardado correctamente la categoria");
        clearForm();
        await find();
      }
    }
  };

  const doUpdate = async () => {
    if (validateForm()) {
      const nivel = padre ? 1 : 0;
      const body = { nombre, codigo, activo, padre, nivel };
      const { type } = await service.update(model._id, body);
      if (type !== "SUCCESS")
        util.error(toast, "No se ha podido actualizar el registro");
      else {
        util.success(toast, "Se ha actualizado correctamente la categoria");
        await find();
      }
    }
  };

  const clearForm = () => {
    setNombre("");
    setCodigo("");
    setPadre("");
  };

  return (
    <>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            id="codigo"
            style={{ textTransform: "uppercase" }}
            className={editClass}
          />
          <label htmlFor="codigo" className={editClass}>
            Ingrese el c&oacute;digo de la categor&iacute;a:
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            id="nombre"
            className={editClass}
          />
          <label htmlFor="nombre" className={editClass}>
            Ingrese el nombre de la categor&iacute;a:
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <Dropdown
            value={padre}
            onChange={(e) => setPadre(e.value)}
            placeholder="Ingrese la categor&iacute;a padre"
            style={{ width: "100%" }}
            options={padreList}
            optionValue="_id"
          />
        </div>
      </div>
      {mode === "UPDATE" && (
        <div className="row">
          <div className="col s12 input-field">
            <Dropdown
              value={activo}
              onChange={(e) => setActivo(e.value)}
              placeholder="Ingrese el estado"
              style={{ width: "100%" }}
              options={util.ESTADO_OPTIONS}
            />
          </div>
        </div>
      )}
      <div className="row">
        <div className="col s12">
          {mode === "SAVE" && (
            <Btn
              name="Guardar"
              icon="add"
              execute={doSave}
              style={{ width: "100%" }}
            />
          )}
          {mode === "UPDATE" && (
            <Btn
              name="Actualizar"
              icon="edit"
              execute={doUpdate}
              style={{ width: "100%" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriaSave;
