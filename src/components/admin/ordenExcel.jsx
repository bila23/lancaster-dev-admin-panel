import React, { useState, useEffect } from "react";
import ordenExcelService from "../../service/modules/ordenExcelService";
import util from "../../service/common/util";
import Loading from "../common/loading";
import { Dropdown } from "primereact/dropdown";

const OrdenExcel = (props) => {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const toast = props.toast;

  function validateField() {
    if (!month) {
      util.warning(toast, "Debe seleccionar un mes");
      return false;
    }
    if (!year) {
      util.warning(toast, "Debe seleccionar un año");
      return false;
    }
    return true;
  }

  const findExtracto = async () => {
    if (validateField()) {
      setLoading(true);
      try {
        const list = await ordenExcelService.findExtracto(month, year);
        if (!list || list.length === 0)
          util.info(toast, "No hay datos para este mes y año");
        else exportResumenExcel(list, `extracto_${month}_${year}.xlsx`);
      } catch (e) {
        console.error(e);
        util.error(toast, "Ha ocurrido un error inesperado");
      }
      setLoading(false);
    }
  };

  const findResumen = async () => {
    if (validateField()) {
      setLoading(true);
      try {
        const list = await ordenExcelService.findResumen(month, year);
        if (!list || list.length === 0)
          util.info(toast, "No hay datos para este mes y año");
        else exportResumenExcel(list, `resumen_${month}_${year}.xlsx`);
      } catch (e) {
        console.error(e);
        util.error(toast, "Ha ocurrido un error inesperado");
      }
      setLoading(false);
    }
  };

  const saveAsExcelFile = (buffer, name) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const data = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        module.default.saveAs(data, name);
      }
    });
  };

  const exportResumenExcel = (list, name) => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(list);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, name);
    });
  };

  return (
    <>
      <div className="row">
        <div className="col s12">
          Debe seleccionar un mes y año para generar uno de los dos informes en
          Excel:
        </div>
      </div>
      <div className="row">
        <div className="col s12 m6">
          <Dropdown
            value={month}
            onChange={(e) => setMonth(e.value)}
            options={util.monthItems}
            placeholder="Seleccione un mes"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col s12 m6">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ textAlign: "center" }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col s12 m6">
          <button
            className="btn btn-small waves-effect waves-light black darken-4"
            onClick={findResumen}
          >
            Generar Resumen
          </button>
        </div>
        <div className="col s12 m6">
          <button
            className="btn btn-small waves-effect waves-light black darken-4"
            onClick={findExtracto}
          >
            Generar Extracto
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col s12 center">{loading && <Loading />}</div>
      </div>
    </>
  );
};

export default OrdenExcel;
