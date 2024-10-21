import http from "../common/httpService";
import moment from "moment";

const api = "/orden";

async function despachado(idOrden) {
  const { data: result } = await http.put(`${api}/despachado/${idOrden}`);
  return result;
}

async function findAll() {
  const { data: result } = await http.get(api);
  return prepareList(result);
}

function prepareList(list) {
  let lst = [];
  for (const model of list) {
    lst.push({
      ...model,
      fecha: moment(model.date).format("DD/MM/YYYY hh:mm:ss"),
      despachadoEstado: !model.despachado ? "NO DESPACHADO" : model.despachado,
    });
  }
  return lst;
}

export default {
  findAll,
  despachado,
};
