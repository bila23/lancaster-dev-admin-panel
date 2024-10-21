import http from "../common/httpService";

const api = "/user-shop";

async function findAll() {
  const { data: result } = await http.get(api);
  return result;
}

async function findOrden(email) {
  const { data: result } = await http.get(`${api}/orden/${email}`);
  return result;
}

export default {
  findAll,
  findOrden,
};
