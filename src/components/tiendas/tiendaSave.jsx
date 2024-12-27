import React from "react";
import service from "../../service/modules/tiendaService";
import SaveUpdateForm from "../common/saveUpdateForm";

const TiendaSave = () => {
  const initialForm = {
    descripcion: "",
  };
  const requiredFields = ["descripcion"];
  const arrayInputs = [
    {
      id: "descripcion",
      type: "text",
      label: "Ingrese la descripcion:",
    },
  ];

  return (
    <>
      <SaveUpdateForm
        inputs={arrayInputs}
        initialForm={initialForm}
        requiredFields={requiredFields}
        service={service}
        find={find}
        isUpdate={isUpdate}
        model={model}
      />
    </>
  );
};

export default TiendaSave;
