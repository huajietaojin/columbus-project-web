import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user-proxy/merchant/tokens',
    method: 'post',
    data: {
      mobile: username,
      password: password
    }
  })
}

export function getUserInfo(unid, token) {
  return request({
    url: '/user-proxy/merchant/users/unid/' + unid,
    method: 'get',
    params: { token }
  })
}

export function logout(unid, token) {
  return request({
    url: '/user-proxy/merchant/tokens/' + unid,
    method: 'delete'
  })
}
