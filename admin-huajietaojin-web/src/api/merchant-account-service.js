import request from '@/utils/request'

const proxy_fix = "/user-proxy";
const MerchantAccountService = {

  listAccountCash: (params) => {
    return request({
      url: proxy_fix + "/merchant/account/cash",
      method: 'get',
      params: params
    })
  },

  getAccountCash: (merchantUnid) => {
    return request({
      url: proxy_fix + "/merchant/account/cash/" + merchantUnid,
      method: 'get'
    })
  },

  listAccountProfile: (params) => {
    return request({
      url: proxy_fix + "/merchant/account/profile",
      method: 'get',
      params: params
    })
  },

  getAccountProfile: (merchantUnid) => {
    return request({
      url: proxy_fix + "/merchant/account/profile/" + merchantUnid,
      method: 'get'
    })
  },

  updateAccountCharge: (merchantUnid, form) => {
    return request({
      url: proxy_fix + "/merchant/account/profile/" + merchantUnid + "/charge",
      method: 'put',
      data: form
    })
  },
}
export default MerchantAccountService
