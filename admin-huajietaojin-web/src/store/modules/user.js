import { login, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, setUnid, getUnid, removeUnid } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    unid: getUnid(),
    mobile: '',
    name: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_UNID: (state, unid) => {
      state.unid = unid
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, info) => {
      state.info = info
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          setUnid(data.unid)
          commit('SET_UNID', data.unid)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getInfo(state.token).then(response => {
        //   const data = response.data
        //   commit('SET_ROLES', data.roles)
        //   commit('SET_NAME', data.name)
        //   commit('SET_AVATAR', data.avatar)
        //   resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
        getUserInfo(state.unid, state.token).then(response => {
          const data = response.data
          // commit('SET_ROLES', data.roles)
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          commit('SET_MOBILE', data.mobile)
          commit('SET_USER', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.unid, state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          commit('SET_UNID', '')
          removeUnid()
          resolve()
        }).catch(error => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          commit('SET_UNID', '')
          removeUnid()
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
