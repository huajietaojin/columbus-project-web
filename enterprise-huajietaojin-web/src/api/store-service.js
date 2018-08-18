import request from '@/utils/request'

const proxy = '/service-proxy'

const StoreService = {
  list: (params) => {
    return request({
      url: proxy + '/stores',
      method: 'get',
      params: params
    })
  },
  get: (id) => {
    return request({
      url: proxy + '/stores/' + id,
      method: 'get'
    })
  },
  getExtraWithPicture: (id) => {
    return request({
      url: proxy + '/stores/' + id + '/extra/with_picture',
      method: 'get'
    })
  },
  create: (form) => {
    return request({
      url: proxy + '/stores',
      method: 'post',
      data: form
    })
  },
  update: (id, form) => {
    return request({
      url: proxy + '/stores/' + id + '/profile/base',
      method: 'put',
      data: form
    })
  },
  remove: (id) => {
    return request({
      url: proxy + '/stores/' + id,
      method: 'delete'
    })
  },
  batchEable: (param) => {
    return request({
      url: proxy + '/stores/batch/enable',
      method: 'put',
      data: param
    })
  }
}
export default StoreService
