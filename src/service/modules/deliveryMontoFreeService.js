import http from "../common/httpService";

const api = "/deliver-monto-free";

async function findAll() {
  const { data } = await http.get(`${api}/all`);
  return data;
}

async function save(body) {
  const { data } = await http.post(api, body);
  return data;
}

async function update(id, body) {
  const { data } = await http.put(`${api}/${id}`, body);
  return data;
}

async function findById(id) {
  const { data } = await http.get(`${api}/${id}`);
  return data;
}

async function deleteById(id) {
  const { data } = await http.delete(`${api}/${id}`);
  return data;
}

export default {
  update,
  findById,
  findAll,
  deleteById,
  save,
};
