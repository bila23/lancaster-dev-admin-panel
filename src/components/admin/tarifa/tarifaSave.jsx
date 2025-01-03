import React, { useState, useEffect, useRef } from "react";
import service from "../../../service/modules/tarifaService";
import util from "../../../service/common/util";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const TarifaSave = ({ row, find, mode }) => {
  const toast = useRef(null);
  const [tarifa, setTarifa] = useState("");
  const [plazo, setPlazo] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [deliveryGratis, setDeliveryGratis] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    if (mode === "UPDATE") fillForm();
  };

  const fillForm = () => {
    setDepartamento(row.departamento);
    setProvincia(row.provincia);
    setDistrito(row.distrito);
    setTarifa(row.tarifa);
    setPlazo(row.plazo);
    setDeliveryGratis(row.deliveryGratis);
  };

  const validateForm = () => {
    if (!departamento) {
      util.warning(toast, "Debe ingresar el departamento");
      return false;
    } else if (!provincia) {
      util.warning(toast, "Debe ingresar la provincia");
      return false;
    } else if (!distrito) {
      util.warning(toast, "Debe ingresa el distrito");
      return false;
    } else if (!tarifa) {
      util.warning(toast, "Debe ingresar la tarifa");
      return false;
    } else if (!plazo) {
      util.warning(toast, "Debe ingresar el plazo");
      return false;
    }
    return true;
  };

  const updateTarifa = async () => {
    if (validateForm()) {
      const body = {
        tarifa,
        plazo,
        departamento: departamento.toUpperCase(),
        provincia: provincia.toUpperCase(),
        distrito: distrito.toUpperCase(),
        deliveryGratis,
      };
      const { type } = await service.update(row._id, body);
      if (type === "SUCCESS") {
        util.success(toast, "Se ha actualizado correctamente el registro");
        await find();
      } else
        util.error(toast, "Ha ocurrido un error al actualizar el registro");
    }
  };

  const clearForm = () => {
    setDepartamento("");
    setDistrito("");
    setProvincia("");
    setPlazo("");
    setTarifa("");
    setDeliveryGratis(false);
  };

  const doSave = async () => {
    if (validateForm()) {
      const body = {
        tarifa,
        plazo,
        departamento: departamento.toUpperCase(),
        provincia: provincia.toUpperCase(),
        distrito: distrito.toUpperCase(),
        deliveryGratis,
      };
      const { type } = await service.save(body);
      if (type === "EXIST")
        util.warning(toast, "El registro que quiere ingresar ya existe");
      else if (type === "SUCCESS") {
        util.success(toast, "Se ha guardado correctamente el registro");
        await find();
        clearForm();
      } else if (type === "ERROR")
        util.error(toast, "Ha ocurrido un error al guardar el registro");
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="row">
        <div className="col s12 input-field">
          <input
            id="departamento"
            type="text"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            style={{ textTransform: "uppercase" }}
          />
          <label htmlFor="departamento">Departamento:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            style={{ textTransform: "uppercase" }}
            id="provincia"
          />
          <label htmlFor="provincia">Provincia:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            style={{ textTransform: "uppercase" }}
            id="distrito"
          />
          <label htmlFor="distrito">Distrito:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="number"
            name="tarifa"
            id="tarifa"
            value={tarifa}
            onChange={(e) => setTarifa(e.target.value)}
          />
          <label htmlFor="tarifa">Tarifa:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          <input
            type="text"
            name="plazo"
            id="plazo"
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
          />
          <label htmlFor="plazo">Plazo:</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <div>Tiene Delivery Gratis:</div>
          <Dropdown
            value={deliveryGratis}
            onChange={(e) => setDeliveryGratis(e.value)}
            options={[
              { label: "Si", value: true },
              { label: "No", value: false },
            ]}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 input-field">
          {mode === "UPDATE" && (
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={updateTarifa}
            >
              Actualizar
            </button>
          )}
          {mode === "SAVE" && (
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={doSave}
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TarifaSave;
