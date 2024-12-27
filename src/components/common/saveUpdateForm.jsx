import React, { useState, useEffect, useRef } from "react";
import Btn from "./btn";
import util from "../../service/common/util";
import InputMate from "./inputMate";
import { Toast } from "primereact/toast";

const SaveUpdateForm = ({
  inputs, // Array de campos a renderizar
  initialForm, // Estado inicial del formulario
  requiredFields, // Campos obligatorios
  service, // Función para guardar (create/update)
  find, // Callback para recargar datos
  isUpdate, // Si es un guardado o una actualización
  model, // Modelo en caso de actualización
}) => {
  const toast = useRef(null);
  const [editClass, setEditClass] = useState("");
  const [form, setForm] = useState(initialForm);

  const init = () => {
    if (isUpdate && model) {
      setForm(model);
      setEditClass("active");
    } else {
      setForm(initialForm);
      setEditClass("");
    }
  };

  useEffect(() => {
    init();
  }, [isUpdate, model]);

  const handleSave = async () => {
    if (util.validateForm(form, requiredFields, toast)) {
      const { type } = isUpdate
        ? await service.update(model._id, form)
        : await service.save(form);
      if (type === "SUCCESS") {
        util.success(toast, "Se ha guardado correctamente el registro");
        await find();
        if (!isUpdate) setForm(initialForm);
      } else util.error(toast, "Ha ocurrido un error al guardar el registro");
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {inputs.map((input, index) => (
        <InputMate
          key={index}
          id={input.id}
          type={input.type}
          value={form[input.id]}
          setForm={setForm}
          label={input.label}
          dwon={input.dwon}
          options={input.options}
          editClass={editClass}
        />
      ))}
      <div className="row">
        <div className="col s12 right-align">
          <Btn
            name={isUpdate ? "Actualizar" : "Guardar"}
            icon={isUpdate ? "edit" : "add"}
            execute={handleSave}
          />
        </div>
      </div>
    </>
  );
};

export default SaveUpdateForm;
