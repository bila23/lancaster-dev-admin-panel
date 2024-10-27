import React, { useState, useEffect } from "react";
import service from "../../service/modules/deliverFreeService";
import util from "../../service/common/util";
import Btn from "../common/btn";
import { InputNumber } from "primereact/inputnumber";

const DeliverFreeSave = ({ find, toast, mode, model }) => {
  const [valor, setValor] = useState("");

  const init = () => {
    if (mode === "UPDATE") fillForm();
  };

  const fillForm = () => {
    setValor(model.valor);
  };

  useEffect(() => {
    init();
  }, []);

  const validateForm = () => {
    if (!valor) {
      util.warning(toast, "Debe ingresar el valor");
      return false;
    } else return true;
  };

  const doSave = async () => {
    if (validateForm()) {
      const body = { valor, activo: true };
      const { type } = await service.save(body);
      if (type !== "SUCCESS")
        util.warning(toast, "No se pudo guardar el registro");
      else {
        util.success(toast, "Se ha guardado correctamente el registro");
        clearForm();
        await find();
      }
    }
  };

  const doUpdate = async () => {
    if (validateForm()) {
      const body = { valor };
      const { type } = await service.update(model._id, body);
      if (type !== "SUCCESS")
        util.error(toast, "No se ha podido actualizar el registro");
      else {
        util.success(toast, "Se ha actualizado correctamente el registro");
        await find();
      }
    }
  };

  const clearForm = () => {
    setValor("");
  };

  return (
    <>
      <div className="row">
        <div className="col s12 input-field">
          <div>Ingrese el valor del Delivery:</div>
          <InputNumber
            value={valor}
            mode="decimal"
            maxFractionDigits={2}
            onValueChange={(e) => setValor(e.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
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

export default DeliverFreeSave;
