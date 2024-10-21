import React, { useRef } from "react";
import ProductoService from "../../service/modules/productoService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ProductoTable = (props) => {
  const { list, actionBodyTemplate, loading, headerTable } = props;
  const dt = useRef(null);

  const result = ProductoService.prepareData(list);

  return (
    <DataTable
      ref={dt}
      value={result}
      loading={loading}
      stripedRows
      paginator
      header={headerTable}
      rows={10}
      filterDisplay="row"
      emptyMessage="No hay registro(s)"
    >
      <Column
        field="id"
        header="ID"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column
        field="nombre"
        header="Nombre"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column
        field="categoriaNombre"
        header="Categoria Padre"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column
        field="categoriaHijaNombre"
        header="Categoria Hija"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column
        field="cantidad"
        header="Cantidad"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column
        field="talla"
        header="Talla"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column
        field="colorNombre"
        header="Color"
        sortable
        filter
        filterMatchMode="contains"
      />
      <Column body={actionBodyTemplate} />
    </DataTable>
  );
};

export default ProductoTable;
