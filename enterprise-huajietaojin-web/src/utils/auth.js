import Cookies from 'js-cookie'

const TokenKey = 'Merchant-Token'
const UnidKey = 'Merchant-Unid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUnid() {
  return Cookies.get(UnidKey)
}

export function setUnid(unid) {
  return Cookies.set(UnidKey, unid)
}

export function removeUnid() {
  return Cookies.remove(UnidKey)
}
