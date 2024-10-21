import React, { useState, useEffect } from "react";
import usuarioService from "../../service/admin/usuarioService";
import util from "../../service/common/util";

const UserForm = (props) => {
  const toast = props.toast;
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const save = async () => {
    if (!nombre) util.warning(toast, "Debe ingresar el usuario");
    else if (!correo) util.warning(toast, "Debe ingresar el correo");
    else if (!password) util.warning(toast, "Debe ingresar la contraseña");
    else {
      const body = {
        password: password,
        nombre: nombre,
        correo: correo,
        activo: true,
        rol: "ADMIN",
      };
      const result = await usuarioService.save(body);
      if (result.type === "SUCCESS") {
        util.success(toast, "Se ha guardado el usuario correctamente");
        setNombre("");
        setCorreo("");
        setPassword("");
        props.setnewDialog(false);
      } else util.warning(toast, result.message);
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
          <label htmlFor="nombre">Ingrese el nombre del usuario:</label>
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
          <label htmlFor="correo">Ingrese el correo del usuario:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="password"
            id="password"
            value={password}
            className="validate"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Ingrese la contrase&ntilde;a:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <button
            className="btn waves-effect waves-light black darken-4"
            onClick={save}
          >
            <i className="material-icons left">done</i>
            Guardar Usuario
          </button>
        </div>
      </div>
    </>
  );
};

export default UserForm;
