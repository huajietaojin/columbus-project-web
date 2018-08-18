import request from '@/utils/request'

const VisitorService = {
  list: (params) => {
    return request({
      url: '/user-proxy/wechat/users',
      method: 'get',
      params: params
    })
  }
  
}
export default VisitorService
