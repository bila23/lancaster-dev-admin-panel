import http from "../common/httpService";
import _ from "lodash";

const api = "/categoria";

async function findAll() {
  const { data } = await http.get(api);
  return data;
}

async function findPadres() {
  const { data: result } = await http.get(`${api}/nivel/0`);
  return prepareList(result);
}

async function save(body) {
  const { data } = await http.post(api, body);
  return data;
}

async function findHijas() {
  const { data: result } = await http.get(`${api}/nivel/1`);
  const list = _.sortBy(result, ["padre.nombre", "nombre"]);
  return prepareList(list);
}

async function findHijasByPadre(padre) {
  const { data: result } = await http.get(`${api}/padre/${padre}`);
  return prepareList(result);
}

function prepareList(list) {
  let lst = [];
  for (const model of list) {
    lst.push({
      ...model,
      label: model.nombre,
      value: model._id + "-" + model.nombre,
    });
  }
  return lst;
}

async function update(id, body) {
  const { data } = await http.put(`${api}/${id}`, body);
  return data;
}

export default {
  update,
  findPadres,
  findHijas,
  prepareList,
  findHijasByPadre,
  findAll,
  save,
};
