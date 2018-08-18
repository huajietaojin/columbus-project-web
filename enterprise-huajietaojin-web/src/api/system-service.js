import request from '@/utils/request'


const proxy_fix = '/system-proxy'

const SystemService = {
  getDefaultUsageCode: (mobile) => {
    return request({
      url: proxy_fix + '/sms/verify/common/defaultusage',
      method: 'post',
      data: {
        mobile: mobile
      }
    })
  },
  getAccountWithdrawCode: (mobile) => {
    return request({
      url: proxy_fix + '/sms/verify/account/withdraw',
      method: 'post',
      data: {
        mobile: mobile
      }
    })
  },
}
export default SystemService
