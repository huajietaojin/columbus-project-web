import request from '@/utils/request'

const proxy_fix = '/user-proxy'

const MerchantWithdrawService = {
  list: (params) => {
    return request({
      url: proxy_fix + "/merchant/withdraw/records",
      method: 'get',
      params: params
    })
  },
  get: (id) => {
    return request({
      url: proxy_fix + "/merchant/withdraw/records/" + id,
      method: 'get'
    })
  },
  create: (form) => {
    return request({
      url: proxy_fix + "/merchant/withdraw/records",
      method: 'post',
      data: form
    })
  },
  update: (id, form) => {
    return request({
      url: proxy_fix + "/merchant/withdraw/records/" + id,
      method: 'put',
      data: form
    })
  },
  remove: (id) => {
    return request({
      url: proxy_fix + "/merchant/withdraw/records/" + id,
      method: 'delete',
    })
  }

}
export default MerchantWithdrawService
