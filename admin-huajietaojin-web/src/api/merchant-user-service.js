import request from '@/utils/request'


const proxy_fix = "/user-proxy"

const MerchantUserService = {
  list: (params) => {
    return request({
      url: proxy_fix + '/merchant/users',
      method: 'get',
      params: params
    })
  },
  get: (unid) => {
    return request({
      url: proxy_fix + '/merchant/users/unid/' + unid,
      method: 'get'
    })
  },
  update: (unid, form) => {
    return request({
      url: proxy_fix + '/merchant/users/unid/' + unid,
      method: 'put',
      data: form
    })
  }
}
export default MerchantUserService
