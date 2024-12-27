import React from "react";
import EmptyField from "../common/emptyField";
import util from "../../service/common/util";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const DmfTable = ({ data, actionBody }) => {
  return (
    <DataTable
      value={data}
      stripedRows
      emptyMessage={<EmptyField message="No hay registros" />}
      showGridlines
    >
      <Column field="monto" header="Monto" />
      {actionBody && <Column body={actionBody} />}
    </DataTable>
  );
};

export default DmfTable;
