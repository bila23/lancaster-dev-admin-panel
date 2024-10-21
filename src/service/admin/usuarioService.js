import http from "../common/httpService";
const api = "/usuario";

async function findAll() {
  const { data: result } = await http.get(api);
  return result;
}

async function save(model) {
  const { data: result } = await http.post(api, model);
  return result;
}

async function findById(id) {
  const { data: model } = await http.get(`${api}/${id}`);
  return model;
}

async function update(model) {
  const { data: result } = await http.put(`${api}/${model._id}`, model);
  return result;
}

export default {
  findAll,
  findById,
  save,
  update,
};
