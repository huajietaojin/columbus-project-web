import request from '@/utils/request'

const top_url = '/service-proxy/firms'

const sub_url = '/service-proxy/firms/'

const FirmService = {
  list: (params) => {
    return request({
      url: top_url,
      method: 'get',
      params: params
    })
  },
  get: (id) => {
    return request({
      url: sub_url + id,
      method: 'get'
    })
  },
  createOrupdate: (form) => {
    return request({
      url: top_url,
      method: 'post',
      data: form
    })
  },
  update: (id, form) => {
    return request({
      url: sub_url + id,
      method: 'put',
      data: form
    })
  },
  getByUser: (userUnid) => {
    return request({
      url: sub_url + 'users/' + userUnid,
      method: 'get'
    })
  }
}
export default FirmService
