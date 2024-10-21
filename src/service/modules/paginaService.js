import http from "../common/httpService";

const api = "/pagina";

async function removeFoto(idPagina, foto) {
  const { data: result } = await http.get(
    `${api}/delete/foto/${idPagina}/${foto}`
  );
  return result;
}

async function updateFotos(id, files) {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  let formData = new FormData();
  let file;
  for (let i = 0; i < files.length; i++) {
    file = files[i];
    formData.append(`file${i}`, file);
  }
  const { data: result } = await http.post(
    `${api}/update/fotos/${id}`,
    formData,
    config
  );
  return result;
}

async function findById(id) {
  const { data: result } = await http.get(`${api}/${id}`);
  return result;
}

async function findAll() {
  const { data: result } = await http.get(api);
  return result;
}

async function save(model) {
  const { data: result } = await http.post(api, model);
  return result;
}

async function update(model) {
  const { data: result } = await http.put(`${api}/${model._id}`, model);
  return result;
}

async function remove(id) {
  const { data: result } = await http.delete(`${api}/${id}`);
  return result;
}

export default {
  findAll,
  save,
  update,
  remove,
  findById,
  updateFotos,
  removeFoto,
};
