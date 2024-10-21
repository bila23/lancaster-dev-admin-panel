import React, { useState, useEffect, useRef } from "react";
import util from "../../service/common/util";
import DescuentoService from "../../service/modules/descuentoService";
import Loading from "../common/loading";
import _ from "lodash";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dialog } from "primereact/dialog";
import { Accordion, AccordionTab } from "primereact/accordion";

const DescuentoQuery = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [inactiveDialog, setInactiveDialog] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [index, setIndex] = useState(0);

  const items = [{ label: "Descuentos" }, { label: "Consulta de Descuentos" }];

  const find = async () => {
    setLoading(true);
    const list = await DescuentoService.findAll();
    if (list && list.length > 0) {
      try {
        const lst = _.chain(list)
          .groupBy("codigo")
          .map((value, key) => ({ codigo: key, values: value }))
          .value();
        setList(lst);
      } catch (e) {
        console.log(e);
        util.error(toast, "Ha ocurrido un error al cargar la informacion");
      }
    } else setList([]);
    setLoading(false);
  };

  useEffect(async () => {
    await find();
  }, []);

  const css = ".p-accordion-header-text {width: 100%}";

  const prepareInactivate = (codigo) => {
    setCodigo(codigo);
    setInactiveDialog(true);
  };

  const header = (row) => {
    const model = _.uniqBy(row.values, "usuarioCrea");
    return (
      <>
        <div className="row">
          <div className="col s10">
            <div className="row">
              <div className="col s6">
                <div>
                  C&oacute;digo de Descuento: {row.codigo} / Estado:{" "}
                  {model[0].estado}
                </div>
              </div>
              <div className="col s6">
                <div>
                  Categor&iacute;a Padre: {model[0].categoriaPadre.nombre}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <div>Etiqueta: {model[0].etiqueta}</div>
              </div>
              <div className="col s6">
                <div>
                  Categor&iacute;a Hija: {model[0].categoriaHija.nombre}
                </div>
              </div>
            </div>
          </div>
          <div className="col s2">
            {model[0].estado === "ACTIVO" && (
              <button
                className="btn waves-effect waves-light black darken-4"
                onClick={(e) => prepareInactivate(row.codigo)}
                style={{ marginBottom: "10px" }}
              >
                INACTIVAR
              </button>
            )}
          </div>
        </div>
      </>
    );
  };

  const inactivate = async () => {
    const result = await DescuentoService.inactivate(codigo);
    if (result.type === "SUCCESS") {
      util.success(toast, "Se ha inactivado el descuento correctamente");
      await find();
    } else
      util.warning(toast, "Ha ocurrido un problema al inactivar el descuento");
    setInactiveDialog(false);
  };

  return (
    <>
      <style>{css}</style>

      <Dialog
        visible={inactiveDialog}
        onHide={(e) => setInactiveDialog(false)}
        showHeader={false}
      >
        <div className="row">
          <div className="col s12">
            <h6>¿Esta seguro que desea inactivar el descuento?</h6>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={inactivate}
            >
              Si
            </button>
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={(e) => setInactiveDialog(false)}
              style={{ marginLeft: "10px" }}
            >
              No
            </button>
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12 m6">
          <h4 className="left text-bold">Consulta de Descuentos</h4>
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
      <div className="card" style={{ padding: "15px" }}>
        <div className="row">
          <div className="col s12">
            <button
              className="btn waves-effect waves-light black darken-4"
              onClick={find}
              style={{ marginBottom: "10px" }}
            >
              Actualizar
            </button>
            {loading && <Loading />}
            {list && list.length > 0 ? (
              <>
                <Accordion
                  activeIndex={index}
                  onTabChange={(e) => setIndex(e.index)}
                >
                  {list &&
                    list.length > 0 &&
                    list.map((first, index) => (
                      <AccordionTab header={header(first)} key={index}>
                        <table>
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Valor Original (S/)</th>
                              <th>Valor Nuevo (S/)</th>
                              <th>Descuento (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {first.values.map((second, index) => (
                              <tr key={index}>
                                <td>
                                  {second &&
                                    second.producto &&
                                    second.producto.nombre}
                                </td>
                                <td>{second && second.valorOriginal}</td>
                                <td>{second && second.valorNuevo}</td>
                                <td>{second && second.porcentaje}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </AccordionTab>
                    ))}
                </Accordion>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col s12"></div>
                </div>
                <div className="row">
                  <div className="col s12">
                    No hay ning&uacute;n descuento registrado
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DescuentoQuery;
