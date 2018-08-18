import request from '@/utils/request'

const proxy_fix = "/user-proxy";
const MerchantAccountService = {

  createBindRecord: (form) => {
    return request({
      url: proxy_fix + "/merchant/accounts/bind/wechat/records",
      method: 'post',
      data: form
    })
  },

  getAccountCash: (merchantUnid) => {
    return request({
      url: proxy_fix + "/merchant/account/cash/" + merchantUnid,
      method: 'get'
    })
  },

  getAccountProfile: (merchantUnid) => {
    return request({
      url: proxy_fix + "/merchant/account/profile/" + merchantUnid,
      method: 'get'
    })
  }
}
export default MerchantAccountService
