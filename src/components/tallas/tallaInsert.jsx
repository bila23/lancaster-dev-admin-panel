import React, { useState, useEffect } from "react";
import TallaService from "../../service/admin/TallaService";
import authService from "../../service/common/authService";
import util from "../../service/common/util";

const TallaInsert = (props) => {
  const { toast, setList, setNewDialog, id } = props;
  const [nombre, setNombre] = useState("");
  const [labelClass, setLabelClass] = useState("");

  useEffect(async () => {
    if (props.id) {
      const talla = await TallaService.findById(props.id);
      setNombre(talla.nombre);
      setLabelClass("active");
    }
  }, []);

  const save = async () => {
    if (!nombre) util.warning(toast, "Debe ingresar el nombre de la talla");
    else {
      try {
        if (!id) await TallaService.save(nombre, authService.getUser());
        else await TallaService.update(id, nombre);
        const list = await TallaService.findAll();
        setList(list);
        setNewDialog(false);
      } catch (e) {
        console.error(e);
        util.error(toast, "Ha ocurrido un error al guardar la talla");
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            name="nombre"
            value={nombre}
            id="nombre"
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="nombre" className={labelClass}>
            Ingrese el nombre de la talla:
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <button
            className="btn waves-effect waves-light black darken-4"
            onClick={save}
          >
            <i className="material-icons left">done</i>
            Guardar Talla
          </button>
        </div>
      </div>
    </>
  );
};

export default TallaInsert;
