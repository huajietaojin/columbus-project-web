import request from '@/utils/request'

const VisitorService = {
  listProduct: (params) => {
    return request({
      url: '/statistic-proxy/visitors/products/wechat/users',
      method: 'get',
      params: params
    })
  },

  listStore: (params) => {
    return request({
      url: '/statistic-proxy/visitors/stores/wechat/users',
      method: 'get',
      params: params
    })
  },

  listCoupon: (params) => {
    return request({
      url: '/statistic-proxy/visitors/coupons/wechat/users',
      method: 'get',
      params: params
    })
  }
  
}
export default VisitorService
