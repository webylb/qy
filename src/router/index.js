import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/f/q/'+ window.infoData.merchantId + '.html/',
  base: '/f/q/100036.html/',
  routes: [
    {
      path: '/',
      meta: {title: '会员特权',keepAlive:false},
      component: () => import(/* webpackChunkName: "member" */ '../views/member/member.vue')
    },
    {
      path: '*',
      meta: {title: '页面找不到',keepAlive:true},
      component: () => import(/* webpackChunkName: "errPage" */ '../views/err-page/404.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {title: '登录',keepAlive:false},
      component: () => import(/* webpackChunkName: "login" */ '../views/login/login.vue')
    },
    //开通会员
    {
      path: '/openMembers',
      name: 'openMembers',
      meta: {title: '开通会员',keepAlive:false},
      component: () => import(/* webpackChunkName: "openMembers" */ '@/views/open-members/open-members.vue')
    },
    //优加开通会员
    {
      path: '/openMerchantMembers',
      name: 'openMerchantMembers',
      meta: {title: '开通会员',keepAlive:false},
      component: () => import(/* webpackChunkName: "openMembers" */ '@/views/open-merchant-members/open-members.vue')
    },
    //首页
    {
      path: '/member',
      name: 'member',
      meta: {title: '会员特权',keepAlive:false},
      component: () => import(/* webpackChunkName: "member" */ '@/views/member/member.vue')
    },
    //会员个人中心
    {
      path: '/myCenter',
      meta: {title: '会员中心',keepAlive:false},
      component: () => import(/* webpackChunkName: "myCenter" */ '../views/my-center/my-center.vue')
    },
    //会员个人信息
    {
      path: '/userInfo',
      meta: {title: '会员中心',keepAlive:false},
      component: () => import(/* webpackChunkName: "myCenter" */ '../views/user-info/user-info.vue')
    },
    //我喜欢
    {
      path: '/favorites',
      name: 'favorites',
      meta: {title: '我的收藏',keepAlive:false},
      component: () => import(/* webpackChunkName: "favorites" */ '@/views/favorites/favorites.vue')
    },
    //承接页
    {
      path: '/continuePage',
      name: 'continuePage',
      meta: {title: '会员特权',keepAlive:false},
      component: () => import(/* webpackChunkName: "continuePage" */ '@/views/continue-page/continue-page.vue')
    },
    //服务中心
    {
      path: '/serviceCenter',
      name: 'serviceCenter',
      meta: {title: '会员商品',keepAlive:true},
      component: () => import(/* webpackChunkName: "serviceCenter" */ '@/views/service-center/service-center.vue')
    },
    //卡券商品
    {
      path: '/couponGoods',
      name: 'couponGoods',
      meta: {title: '',keepAlive:false},
      component: () => import(/* webpackChunkName: "couponGoods" */ '@/views/coupon-goods/coupon-goods.vue')
    },
    //我的优惠
    {
      path: '/myBill',
      meta: {title: '我的优惠',keepAlive:false},
      component: () => import(/* webpackChunkName: "myCenter" */ '../views/my-bill/my-bill.vue')
    },
    //常见问题
    {
      path: '/commomQuestion',
      meta: {title: '常见问题',keepAlive:false},
      component: () => import(/* webpackChunkName: "myCenter" */ '../views/common-question/common-question.vue')
    },
     //用户保障
    {
      path: '/userSecurity',
      meta: {title: '会员保障',keepAlive:false},
      component: () => import(/* webpackChunkName: "myCenter" */ '../views/user-security/user-security.vue')
    },
    //订单
    {
      path: '/orderForm',
      name: 'orderForm',
      meta: {title: '我的订单',keepAlive:true},
      component: () => import(/* webpackChunkName: "orderForm" */ '@/views/order-form/order-form.vue')
    },
    //购买成功
    {
      path: '/successPage',
      name: 'successPage',
      meta: {title: '成功',keepAlive:false},
      component: () => import(/* webpackChunkName: "successPage" */ '@/views/success-page/success-page.vue')
    },
    //卡券中心
    {
      path: '/myCoupon',
      name: 'myCoupon',
      meta: {title: '我的卡券',keepAlive:false},
      component: () => import(/* webpackChunkName: "myCoupon" */ '@/views/my-coupon/my-coupon.vue')
    },
    //券包中心
    {
      path: '/couponBagCenter',
      name: 'couponBagCenter',
      meta: {title: '礼包中心',keepAlive: true},
      component: () => import(/* webpackChunkName: "couponBag" */ '@/views/coupon-bag-center/coupon-bag-center.vue')
    },
    //券包首页
    {
      path: '/couponBag',
      name: 'couponBag',
      meta: {title: '礼包详情',keepAlive:false},
      component: () => import(/* webpackChunkName: "couponBag" */ '@/views/coupon-bag/coupon-bag.vue')
    },
    //卡券包商品
    {
      path: '/couponBagGoods',
      name: 'couponBagGoods',
      meta: {title: '',keepAlive:false},
      component: () => import(/* webpackChunkName: "couponBag" */ '@/views/coupon-bag-goods/coupon-bag-goods.vue')
    },
    //券包收银台
    {
      path: '/cashier',
      name: 'cashier',
      meta: {title: '收银台',keepAlive:false},
      component: () => import(/* webpackChunkName: "couponBag" */ '@/views/cashier/cashier.vue')
    },
    //新人礼包
    {
      path: '/newUserCouponBag',
      name: 'newUserCouponBag',
      meta: {title: '新人礼包',keepAlive:false},
      component: () => import(/* webpackChunkName: "couponBag" */ '@/views/coupon-bag-new-user/coupon-bag.vue')
    },
    //vip礼包
    {
      path: '/vipUserCouponBag',
      name: 'vipUserCouponBag',
      meta: {title: '会员礼包',keepAlive:false},
      component: () => import(/* webpackChunkName: "couponBag" */ '@/views/coupon-bag-vip-user/coupon-bag.vue')
    },
    // 活动礼包Christmas
    {
      path: '/christmasCouponBag',
      name: 'christmasCouponBag',
      meta: {title: '圣诞礼包',keepAlive:false},
      component: () => import(/* webpackChunkName: "activeCouponBag" */ '@/views/coupon-bag-active-temeplate/christmas-coupon-bag.vue')
    },
    // 活动礼包规则
    {
      path: '/couponBagActiveRules',
      name: 'couponBagActiveRules',
      meta: {title: '圣诞礼包',keepAlive:false},
      component: () => import(/* webpackChunkName: "activeCouponBag" */ '@/views/coupon-bag-active-rules/coupon-bag-active-rules.vue')
    }
  ]
})
