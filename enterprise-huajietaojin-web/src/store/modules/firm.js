import firmService from '@/api/firm-service.js'
import { getUnid } from '@/utils/auth'

const firm = {
  state: {
    info: {}
  },

  mutations: {
    SET_FIRM: (state, firm) => {
      state.info = firm
    }
  },

  actions: {
    // 获取企业信息
    FetchFirmData: ({ commit }) => {
      const userUnid = getUnid()
      firmService
        .getByUser(userUnid)
        .then(response => {
          const data = response.data
          commit('SET_FIRM', data)
        })
        .catch(err => {
          // console.log('firm err', err)
          // return Promise.reject(err)
        })
    }
  }
}

export default firm
