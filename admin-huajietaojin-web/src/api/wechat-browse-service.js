import request from '@/utils/request'

const VisitorService = {
  list: (params) => {
    return request({
      url: '/statistic-proxy/visitors/browses/wechat/users',
      method: 'get',
      params: params
    })
  }
  
}
export default VisitorService
