import request from '@/utils/request'


const QrcodeService = {
  createStorePreview: (form) => {
    return request({
      url: '/system-proxy/qrcode/images/stores/preview',
      method: 'post',
      data: form
    })
  },

  createCouponPreview: (form) => {
    return request({
      url: '/system-proxy/qrcode/images/coupons/preview',
      method: 'post',
      data: form
    })
  }

}
export default QrcodeService
