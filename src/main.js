// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'
import Qs from 'qs'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = axios;
Vue.prototype.$qs = Qs;


// router
router.beforeEach(function(to,from,next){
  document.title = to.meta.title; //设置页面title
  next();
})

// VueLazyload
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'static/images/imgfail.jpg',
  loading: 'static/images/imgload.gif',
  attempt: 1
})

// 缓存报错问题
try {
  JSON.parse(localStorage.getItem('userinfo'))
} catch (error) {
  localStorage.clear();
}
// Vuex
const store = new Vuex.Store({
  state: {
    loadShow:false,  //load加载
    userinfo:JSON.parse(localStorage.getItem('userinfo')) || { sex:2 },  //用户信息
    uid:localStorage.getItem('uid') || uuid(8,16), 
    isLogin:localStorage.getItem('uid')?true:false, //是否登录
    channel:localStorage.getItem('channel') || 0,
  },
  mutations: {
    // 渠道
    getchannel(state,channel){
      state.channel = channel;
      localStorage.setItem('channel',channel);
    },
    getinfo(state,userinfo){
      state.userinfo = userinfo;
      localStorage.setItem('userinfo',JSON.stringify(userinfo));
    },
  	login(state,uid){
      state.uid = uid;
      state.isLogin = true;
      localStorage.setItem('uid',uid);
    },
    Signout(state){
      state.isLogin = false;
      localStorage.removeItem('uid');
      localStorage.removeItem('userinfo');
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


// uuid
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}