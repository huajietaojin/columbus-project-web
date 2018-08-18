import request from '@/utils/request'

const top_url = '/statistic-proxy/merchants/trades/records'

const sub_url = '/statistic-proxy//merchants/trades/records/'

const TradeRecordService = {
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
  update: (id, form) => {
    return request({
      url: sub_url + id,
      method: 'put',
      data: form
    })
  }
}
export default TradeRecordService
