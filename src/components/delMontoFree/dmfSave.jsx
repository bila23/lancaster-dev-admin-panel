import React from "react";
import service from "../../service/modules/deliveryMontoFreeService";
import SaveUpdateForm from "../common/saveUpdateForm";

const DmfSave = ({ find, model, isUpdate }) => {
  const initialForm = {
    monto: "",
  };
  const requiredFields = ["monto"];
  const arrayInputs = [
    {
      id: "monto",
      type: "number",
      label: "Ingrese el monto:",
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

export default DmfSave;
