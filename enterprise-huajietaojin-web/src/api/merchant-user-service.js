import request from '@/utils/request'


const sub_url = '/user-proxy/merchant/users/unid/'

const MerchantUserService = {
  get: (unid) => {
    return request({
      url: sub_url + unid,
      method: 'get'
    })
  },
  update: (unid, form) => {
    return request({
      url: sub_url + unid,
      method: 'put',
      data: form
    })
  }
}
export default MerchantUserService
