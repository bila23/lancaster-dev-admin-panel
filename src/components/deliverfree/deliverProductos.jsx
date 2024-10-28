import React, { useState, useEffect } from "react";
import categoriaService from "../../service/modules/categoriaService";
import service from "../../service/modules/deliverFreeService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const DeliverProductos = ({ toast, idDelivery }) => {
  const [catList, setCatList] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState([]);
  const [model, setModel] = useState("");

  const find = async () => {
    const catResult = await categoriaService.findAll();
    setCatList(catResult);

    const result = await service.findById(idDelivery);
    if (result) {
      setModel(result);
      setData(result.categorias);
    }
  };

  useEffect(() => {
    find();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <div className="row">
        <div className="col s12">
          <Dropdown
            placeholder="Seleccione una categoría"
            options={catList}
            optionValue="_id"
            optionLabel="nombre"
            value={categoria}
            onChange={(e) => setCategoria(e.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default DeliverProductos;
