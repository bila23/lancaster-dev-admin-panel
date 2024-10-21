import React, { useState, useEffect } from "react";
import usuarioService from "../../service/admin/usuarioService";
import util from "../../service/common/util";
import { Dropdown } from "primereact/dropdown";

const UsuarioEdit = (props) => {
  const toast = props.toast;
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [activo, setActivo] = useState("");
  const [id, setId] = useState(props.id);
  const activoItems = [
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ];

  useEffect(async () => {
    const model = await usuarioService.findById(id);
    if (model) {
      setId(model._id);
      setNombre(model.nombre);
      setCorreo(model.correo);
      setActivo(model.activo);
    }
  }, []);

  const update = async () => {
    if (!nombre) util.warning(toast, "Debe ingresar el usuario");
    else if (!correo) util.warning(toast, "Debe ingresar el correo");
    else {
      const body = {
        nombre: nombre,
        correo: correo,
        activo: activo,
        _id: id,
      };
      const result = await usuarioService.update(body);
      if (result.type === "SUCCESS")
        util.success(toast, "Se ha actualizado el usuario correctamente");
      else
        util.warning(
          toast,
          "Ha ocurrido un error al tratar de actualizar el usuario"
        );
    }
  };

  return (
    <>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            id="nombre"
            value={nombre}
            className="validate"
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="nombre" className="active">
            Ingrese el nombre del usuario:
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="email"
            id="correo"
            value={correo}
            className="validate"
            onChange={(e) => setCorreo(e.target.value)}
          />
          <label htmlFor="correo" className="active">
            Ingrese el correo del usuario:
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <Dropdown
            options={activoItems}
            value={activo}
            onChange={(e) => setActivo(e.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <button
            className="btn waves-effect waves-light black darken-4"
            onClick={update}
          >
            <i className="material-icons left">done</i>
            Actualizar Usuario
          </button>
        </div>
      </div>
    </>
  );
};

export default UsuarioEdit;
