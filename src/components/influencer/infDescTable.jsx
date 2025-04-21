import React from "react";
import EmptyField from "../common/emptyField";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const InfDescTable = ({ data, actionBody }) => {
  return (
    <DataTable
      value={data}
      stripedRows
      emptyMessage={<EmptyField message="No hay registros" />}
      showGridlines
    >
      <Column field="codigo" header="Codigo" />
      <Column field="influencer" header="Influencer" />
      <Column field="descripcion" header="Descripcion" />
      <Column field="descuento" header="Descuento" />
      <Column field="activoString" header="Activo" />
      {actionBody && <Column body={actionBody} />}
    </DataTable>
  );
};

export default InfDescTable;
