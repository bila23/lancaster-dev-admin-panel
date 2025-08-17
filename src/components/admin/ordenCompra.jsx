import { useState, useEffect, useRef } from "react";
import OrdenTable from "./orden/ordenTable";
import ordenCompraService from "../../service/modules/ordenCompraService";
import util from "../../service/common/util";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";

const OrdenCompra = ({ visible }) => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const items = [{ label: "Administración" }, { label: "Orden de Compra" }];

  const find = async () => {
    setLoading(true);
    try {
      const result = await ordenCompraService.findNubefact();
      setList(result);
    } catch (e) {
      console.error(e);
      util.error(toast, "Ha ocurrido un error inesperado");
    }
    setLoading(false);
  };

  useEffect(async () => {
    await find();
  }, []);

  const css = `.pi{margin-right: 10px}`;

  return (
    <>
      <style>{css}</style>

      <Toast ref={toast} />
      {!visible && (
        <>
          <div className="row" style={{ marginBottom: "0px" }}>
            <div className="col s12 m6">
              <h4 className="left text-bold">Consulta de Ordenes de Compra</h4>
            </div>
            <div className="col s12 m6">
              <h4 className="right">
                <BreadCrumb
                  model={items}
                  home={util.home}
                  style={{ heigth: "37px" }}
                />
              </h4>
            </div>
          </div>
        </>
      )}
      <OrdenTable list={list} loading={loading} find={find} />
    </>
  );
};

export default OrdenCompra;
