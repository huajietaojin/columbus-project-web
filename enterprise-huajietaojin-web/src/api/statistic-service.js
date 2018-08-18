import request from '@/utils/request'

const coupon_url = '/statistic-proxy/echarts/coupons/figures'

const store_url = '/statistic-proxy/echarts/stores/figures'

const money_url = '/statistic-proxy/echarts/money/figures'

const product_url = '/statistic-proxy/echarts/products/figures'

const contrast_url = '/statistic-proxy/echarts/{1}/contrasts'

const daily_url = '/statistic-proxy/firms/daily/datas'

const Statistic = {
  
  getDataContrast: (type, params) => {
    let url = contrast_url.replace('{1}', type)
    return request({
      url: url,
      method: 'get',
      params: params
    })
  },

  getCouponChart: (params) => {
    return request({
      url: coupon_url,
      method: 'get',
      params: params
    })
  },

  getStoreChart: (params) => {
    return request({
      url: store_url,
      method: 'get',
      params: params
    })
  },

  getMoneyChart: (params) => {
    return request({
      url: money_url,
      method: 'get',
      params: params
    })
  },

  getProductChart: (params) => {
    return request({
      url: product_url,
      method: 'get',
      params: params
    })
  },

  getDataDaily: (params) => {
    return request({
      url: daily_url,
      method: 'get',
      params: params
    })
  },

}
export default Statistic
