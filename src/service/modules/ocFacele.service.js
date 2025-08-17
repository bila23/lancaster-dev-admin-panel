import http from "../common/httpService";
import moment from "moment";

const api = "/orden-facele";

async function findAll() {
  const { data } = await http.get(api);
  return prepareList(data);
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
};
