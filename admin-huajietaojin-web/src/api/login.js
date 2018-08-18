import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user-proxy/admin/tokens',
    method: 'post',
    data: {
      mobile: username,
      password: password
    }
  })
}

export function getUserInfo(unid, token) {
  return request({
    url: '/user-proxy/admin/users/unid/' + unid,
    method: 'get',
    params: { token }
  })
}

export function logout(unid, token) {
  return request({
    url: '/user-proxy/admin/tokens/' + unid,
    method: 'delete'
  })
}
