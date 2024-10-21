import http from "../common/httpService";

const api = "/tarifas";

async function findAll() {
  const { data } = await http.get(api);
  return data;
}

async function findById(id) {
  const { data } = await http.get(`${api}/${id}`);
  return data;
}

async function update(id, model) {
  const { data } = await http.put(`${api}/${id}`, model);
  return data;
}

async function save(body) {
  const { data } = await http.post(api, body);
  return data;
}

export default { findAll, findById, update, save };
