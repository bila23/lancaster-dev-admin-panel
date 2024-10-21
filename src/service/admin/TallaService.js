import http from "../common/httpService";

const api = "/talla";

async function findAll() {
  const { data: result } = await http.get(`${api}`);
  let list = [];
  for (const model of result)
    list.push({
      _id: model._id,
      nombre: model.nombre,
      estado: model.activo ? "ACTIVO" : "INACTIVO",
    });
  return list;
}

async function findActive() {
  const { data: result } = await http.get(`${api}/active`);
  return result;
}

async function findById(id) {
  const { data: result } = await http.get(`${api}/${id}`);
  return result;
}

async function save(nombre, user) {
  const model = { nombre: nombre, activo: true, usuarioCrea: user };
  const { data: result } = await http.post(`${api}`, model);
  return result;
}

async function update(id, nombre) {
  const model = { nombre: nombre };
  const { data: result } = await http.put(`${api}/${id}`, model);
  return result;
}

export default {
  findAll,
  findActive,
  findById,
  save,
  update,
};
