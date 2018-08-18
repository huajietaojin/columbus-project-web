import request from '@/utils/request';

const url_citys = '/system-proxy/district/provinces/{provinceNo}/citys';

const url_regions = '/system-proxy/district/citys/{cityNo}/regions';

const ChinaService = {
  provinces: [{ n: 110000, m: '北京市' }, { n: 120000, m: '天津市' }, { n: 130000, m: '河北省' }, { n: 140000, m: '山西省' }, { n: 150000, m: '内蒙古自治区' }, { n: 210000, m: '辽宁省' }, { n: 220000, m: '吉林省' }, { n: 230000, m: '黑龙江省' }, { n: 310000, m: '上海市' }, { n: 320000, m: '江苏省' }, { n: 330000, m: '浙江省' }, { n: 340000, m: '安徽省' }, { n: 350000, m: '福建省' }, { n: 360000, m: '江西省' }, { n: 370000, m: '山东省' }, { n: 410000, m: '河南省' }, { n: 420000, m: '湖北省' }, { n: 430000, m: '湖南省' }, { n: 440000, m: '广东省' }, { n: 450000, m: '广西壮族自治区' }, { n: 460000, m: '海南省' }, { n: 500000, m: '重庆市' }, { n: 510000, m: '四川省' }, { n: 520000, m: '贵州省' }, { n: 530000, m: '云南省' }, { n: 540000, m: '西藏自治区' }, { n: 610000, m: '陕西省' }, { n: 620000, m: '甘肃省' }, { n: 630000, m: '青海省' }, { n: 640000, m: '宁夏回族自治区' }, { n: 650000, m: '新疆维吾尔自治区' }, { n: 710000, m: '台湾省' }, { n: 810000, m: '香港特别行政区' }, { n: 820000, m: '澳门特别行政区' }],

  listCitys: (provinceNo) => {
    const url = url_citys.replace('{provinceNo}', provinceNo)
    return request({
      url: url,
      method: 'get'
    })
  },
  listRegions: (cityNo) => {
    const url = url_regions.replace('{cityNo}', cityNo)
    return request({
      url: url,
      method: 'get'
    })
  }
}

export default ChinaService
