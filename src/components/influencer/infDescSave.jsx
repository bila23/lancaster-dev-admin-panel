import React from "react";
import service from "../../service/modules/infDescService";
import SaveUpdateForm from "../common/saveUpdateForm";

const InfDescSave = ({ find, model, isUpdate }) => {
  const initialForm = {
    codigo: "",
    influencer: "",
    activo: true,
    descuento: "",
    descripcion: "",
  };
  const requiredFields = ["codigo", "influencer", "descripcion", "descuento"];
  const arrayInputs = [
    {
      id: "codigo",
      type: "text",
      label: "Ingrese el codigo de descuento:",
    },
    {
      id: "influencer",
      type: "text",
      label: "Ingrese el nombre del influencer:",
    },
    {
      id: "descripcion",
      type: "text",
      label: "Ingrese la descripcion:",
    },
    {
      id: "descuento",
      type: "number",
      label: "Ingrese el porcentaje de descuento:",
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

export default InfDescSave;
