import http from "../common/httpService";

const api = "/orden-excel";

async function findExtracto(month, year) {
  const { data: result } = await http.get(
    `${api}/extracto/month/${month}/year/${year}`
  );
  return result;
}

async function findResumen(month, year) {
  const { data: result } = await http.get(
    `${api}/resumen/month/${month}/year/${year}`
  );
  return result;
}

export default {
  findResumen,
  findExtracto,
};
