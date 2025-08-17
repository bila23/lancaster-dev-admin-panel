import { useState, useEffect, useRef } from "react";
import service from "../../../service/modules/ocFacele.service";
import OrdenTable from "../orden/ordenTable";
import util from "../../../service/common/util";
import { Toast } from "primereact/toast";

const OrdenFaceleQuery = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const find = async () => {
    setLoading(true);
    try {
      const result = await service.findAll();
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

  return (
    <>
      <Toast ref={toast} />
      <OrdenTable list={list} loading={loading} find={find} />
    </>
  );
};

export default OrdenFaceleQuery;
