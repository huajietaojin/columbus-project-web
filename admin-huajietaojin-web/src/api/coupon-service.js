import request from '@/utils/request'

const top_url = '/service-proxy/coupons'

const sub_url = '/service-proxy/coupons/'

const CouponService = {
  list: (params) => {
    return request({
      url: top_url,
      method: 'get',
      params: params
    })
  },
  get: (id) => {
    return request({
      url: sub_url + id + '/extra',
      method: 'get'
    })
  },
  create: (form) => {
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
  remove: (id) => {
    return request({
      url: sub_url + id,
      method: 'delete'
    })
  },
  batchEable: (param) => {
    return request({
      url: top_url + '/batch/enable',
      method: 'put',
      data: param
    })
  }
}

export default CouponService
