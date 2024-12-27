import React from "react";
import EmptyField from "../common/emptyField";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TiendaTable = ({ data, actionBody }) => {
  return (
    <DataTable
      value={data}
      stripedRows
      emptyMessage={<EmptyField message="No hay registros" />}
      showGridlines
    >
      <Column field="descripcion" header="Descripcion" />
      {actionBody && <Column body={actionBody} />}
    </DataTable>
  );
};

export default TiendaTable;
