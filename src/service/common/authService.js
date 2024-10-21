import http from "./httpService";
import jwtDecode from "jwt-decode";

const api = "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(correo, password) {
  const { data: jwt } = await http.post(api, { correo, password });
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getRol() {
  try {
    const jwt = getCurrentUser();
    if (!jwt) return null;
    return jwt.rol;
  } catch (ex) {
    return null;
  }
}

export function getUser() {
  try {
    const jwt = getCurrentUser();
    if (!jwt) return null;
    return jwt.nombre;
  } catch (ex) {
    return null;
  }
}

export function getUserId() {
  try {
    const jwt = getCurrentUser();
    if (!jwt) return null;
    return jwt._id;
  } catch (ex) {
    return null;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt,
  getUser,
  getRol,
  getUserId,
};
