import http from "../common/httpService";
import moment from "moment";

const api = "/deliver-free";

async function findAll() {
  const { data } = await http.get(api);
  const result = [];
  if (data && data.length > 0) {
    for (const m of data)
      result.push({
        ...m,
        fechaCreaString: moment(m.fechaCrea).format("DD/MM/YYYY hh:mm:ss"),
      });
  }
  return result;
}

async function findActive() {
  const { data } = await http.get(`${api}/active`);
  return data;
}

async function findById(id) {
  const { data } = await http.get(`${api}/${id}`);
  return data;
}

async function save(body) {
  const { data } = await http.post(api, body);
  return data;
}

async function deleteById(id) {
  const { data } = await http.delete(`${api}/${id}`);
  return data;
}

async function addCategoria(id, body) {
  const { data } = await http.put(`${api}/add/cat/${id}`, body);
  return data;
}

async function deleteCategoria(id, idcat) {
  const { data } = await http.put(`${api}/delete/cat/${id}/${idcat}`);
  return data;
}

async function update(id, body) {
  const { data } = await http.put(`${api}/${id}`, body);
  return data;
}

export default {
  deleteById,
  findById,
  findActive,
  update,
  findAll,
  save,
  addCategoria,
  deleteCategoria,
};
