import request from '@/utils/request'

const proxy = '/service-proxy'

const StoreVideoService = {
  list: (params) => {
    return request({
      url: proxy + '/storevideos',
      method: 'get',
      params: params
    })
  },
  get: (id) => {
    return request({
      url: proxy + '/storevideos/' + id,
      method: 'get'
    })
  },
  create: (form) => {
    return request({
      url: proxy + '/storevideos',
      method: 'post',
      data: form
    })
  },
  update: (id, form) => {
    return request({
      url: proxy + '/storevideos/' + id + '/profile/base',
      method: 'put',
      data: form
    })
  },
  remove: (id) => {
    return request({
      url: proxy + '/storevideos/' + id,
      method: 'delete'
    })
  },
  batchEable: (param) => {
    return request({
      url: proxy + '/storevideos/batch/enable',
      method: 'put',
      data: param
    })
  }
}
export default StoreVideoService
