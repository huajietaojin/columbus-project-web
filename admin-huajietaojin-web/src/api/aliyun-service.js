import request from '@/utils/request'
import axios from 'axios'
import md5 from 'js-md5'
import {
  getUnid
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: 'http://firstbucker.oss-cn-shenzhen.aliyuncs.com', // api的base_url
  timeout: 15000 // 请求超时时间
})

const AliyunService = {
  getSignature: () => {
    return request({
      url: '/system-proxy/aliyun/oss/signature/merchant',
      method: 'get',
      params: {
        callback: false
      }
    })
  },

  getFileName: (name) => {
    if (!name) {
      return '';
    }
    let time = new Date().getTime()
    let ldot = name.lastIndexOf(".");
    if (ldot < 0) {
      return md5(name + time);
    }
    return md5(name + time) + name.substring(ldot);
  },

  upload: (file, ossToken, prefix) => {
    const headers = {
      'Content-Type': 'multipart/form-data'
    } // 添加请求头
    return new Promise((resolve, reject) => {
      let formData = new FormData() // 创建form对象
      let key = ossToken.dir + getUnid() + '/' + prefix + AliyunService.getFileName(file.name)
      formData.append('key', key)
      formData.append('OSSAccessKeyId', ossToken.accessid)
      formData.append('policy', ossToken.policy)
      formData.append('signature', ossToken.signature)
      formData.append('success_action_status', '200')
      formData.append('file', file)
      service({
          url: ossToken.host,
          method: 'post',
          data: formData,
          headers: headers
        })
        .then(res => {
          const url = ossToken.host + '/' + key
          resolve(url)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

export default AliyunService
