import request from '@/utils/request'


const sub_url = '/user-proxy/wechat/users/'

const WechatUserService = {
  get: (openid) => {
    return request({
      url: sub_url + openid,
      method: 'get'
    })
  }
 
}
export default WechatUserService
