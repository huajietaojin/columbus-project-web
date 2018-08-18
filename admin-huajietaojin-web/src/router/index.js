import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  // { path: '/register', component: () => import('@/views/login/register'), hidden: true },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制面板', icon: 'dashboard', noCache: true }
    }]
  },

  {
    path: '/firms',
    component: Layout,
    redirect: '/firms/list',
    name: 'Firm',
    meta: { title: '企业管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'FirmIndex',
        component: () => import('@/views/firm/FirmIndex'),
        meta: { title: '企业列表', icon: 'example' }
      },
      {
        path: ':id/detail',
        name: 'FirmDetail',
        hidden: true,
        component: () => import('@/views/firm/FirmDetail'),
        meta: { title: '企业详情', icon: 'form' }
      },
      {
        path: ':id/update',
        name: 'FirmUpdate',
        hidden: true,
        component: () => import('@/views/firm/FirmUpdate'),
        meta: { title: '企业修改', icon: 'tree' }
      },

      {
        path: 'stores/list',
        name: 'StoreIndex',
        component: () => import('@/views/store/StoreIndex'),
        meta: { title: '门店列表', icon: 'component' }
      },
      {
        path: 'stores/:id/detail',
        name: 'StoreDetail',
        hidden: true,
        component: () => import('@/views/store/StoreDetail'),
        meta: { title: '门店详情', icon: 'form' }
      },
      {
        path: 'stores/:id/update',
        name: 'StoreUpdate',
        hidden: true,
        component: () => import('@/views/store/StoreUpdate'),
        meta: { title: '门店修改', icon: 'form' }
      },
      {
        path: 'videos/list',
        name: 'StoreVideoIndex',
        component: () => import('@/views/storevideo/StoreVideoIndex'),
        meta: { title: '视频列表', icon: 'table' }
      },
      {
        path: 'videos/create',
        name: 'StoreVideoCreate',
        hidden: true,
        component: () => import('@/views/storevideo/StoreVideoCreate'),
        meta: { title: '创建视频', icon: 'form' }
      },
      {
        path: 'videos/:id/detail',
        name: 'StoreVideoDetail',
        hidden: true,
        component: () => import('@/views/storevideo/StoreVideoDetail'),
        meta: { title: '视频详情', icon: 'form' }
      },
      {
        path: 'videos/:id/update',
        name: 'StoreVideoUpdate',
        hidden: true,
        component: () => import('@/views/storevideo/StoreVideoUpdate'),
        meta: { title: '视频修改', icon: 'form' }
      },
      {
        path: 'coupons/list',
        name: 'CouponIndex',
        component: () => import('@/views/coupon/CouponIndex'),
        meta: { title: '现金券列表', icon: 'money' }
      },
      {
        path: 'coupons/:id/detail',
        name: 'CouponDetail',
        hidden: true,
        component: () => import('@/views/coupon/CouponDetail'),
        meta: { title: '现金券详情', icon: 'form' }
      },
      {
        path: 'coupons/:id/update',
        name: 'CouponUpdate',
        hidden: true,
        component: () => import('@/views/coupon/CouponUpdate'),
        meta: { title: '现金券修改', icon: 'form' }
      },
      {
        path: 'procducts/list',
        name: 'ProductIndex',
        component: () => import('@/views/product/ProductIndex'),
        meta: { title: '商品列表', icon: 'shoppingCard' }
      },
      {
        path: 'procducts/:id/detail',
        name: 'ProductDetail',
        hidden: true,
        component: () => import('@/views/product/ProductDetail'),
        meta: { title: '商品详情', icon: 'form' }
      },
      {
        path: 'procducts/:id/update',
        name: 'ProductUpdate',
        hidden: true,
        component: () => import('@/views/product/ProductUpdate'),
        meta: { title: '商品修改', icon: 'form' }
      }
    ]
  },

  {
    path: '/statistic',
    component: Layout,
    redirect: '/statistic/trade-records',
    name: 'Statsitc',
    meta: { title: '数据统计', icon: 'chart' },
    children: [
      {
        path: 'trade-records',
        name: 'TradeRecord',
        component: () => import('@/views/statistic/TradeRecord'),
        meta: { title: '交易记录', icon: 'form' }
      },
      {
        path: 'trading',
        name: 'TradingChart',
        component: () => import('@/views/statistic/TradingChart'),
        meta: { title: '交易类报表', icon: 'form' }
      },
      {
        path: 'store-statistic',
        name: 'StoreStatistic',
        component: () => import('@/views/statistic/StoreStatistic'),
        meta: { title: '门店统计', icon: 'form' }
      },
      {
        path: 'coupon-statistic',
        name: 'CouponStatistic',
        component: () => import('@/views/statistic/CouponStatistic'),
        meta: { title: '现金券统计', icon: 'form' }
      },
      {
        path: 'product-statistic',
        name: 'ProductStatistic',
        component: () => import('@/views/statistic/ProductStatistic'),
        meta: { title: '商品统计', icon: 'form' }
      },


    ]
  },

  {
    path: '/wechat-users',
    component: Layout,
    redirect: '/wechat-users/list',
    name: 'WechatUser',
    meta: { title: '微信用户', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'WechatUserIndex',
        component: () => import('@/views/wechatuser/WechatUserIndex'),
        meta: { title: '用户列表', icon: 'example' }
      },
      {
        path: 'browses',
        name: 'WechatBrowseIndex',
        component: () => import('@/views/wechatuser/WechatBrowseIndex'),
        meta: { title: '浏览记录', icon: 'example' }
      },
    ]
  },

  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/user/list',
    name: 'Merchant',
    meta: { title: '商家用户', icon: 'table' },
    children: [
      {
        path: 'user/list',
        name: 'MerchantUserIndex',
        component: () => import('@/views/merchant/MerchantUserIndex'),
        meta: { title: '用户列表', icon: 'example' }
      },
      {
        path: 'account/proflie',
        name: 'MerchantAccountProfileIndex',
        component: () => import('@/views/merchant/MerchantAccountProfileIndex'),
        meta: { title: '账户列表', icon: 'example' }
      },
      {
        path: 'account/cash',
        name: 'MerchantAccountCashIndex',
        component: () => import('@/views/merchant/MerchantAccountCashIndex'),
        meta: { title: '资金列表', icon: 'example' }
      },
      {
        path: 'withdraw',
        name: 'MerchantWithdraw',
        component: () => import('@/views/merchantwithdraw/MerchantWithdrawIndex'),
        meta: { title: '提现记录', icon: 'chart' }
      },
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/person',
    name: 'Setting',
    meta: { title: '管理设置', icon: 'tab' },
    children: [
      {
        path: 'person',
        name: 'PersonUpdate',
        component: () => import('@/views/setting/PersonSetting'),
        meta: { title: '个人信息', icon: 'peoples' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

