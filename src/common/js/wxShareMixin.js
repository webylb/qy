import wx from 'weixin-js-sdk'

export default {
  data() {
    return {
      shareUrl: location.href.split('#')[0],
      shareLink: window.location.href.split("#")[0] + '#' + window.location.href.split("#")[1],  //分享出去的链接
      shareTitle: '',  //分享的标题
      shareDesc: '', //分享的详情介绍
      shareImgUrl: '',
      shareHidden: false,
      getLocation1:false
    }
  },
  methods: {
    //微信分享使用方法
    getShare() {
      // console.log('getshare');
      this.$jsonp('https://m.51jujibao.com/user/share/jsonp/post', {
        'url': this.shareUrl,
        'd': (new Date().getTime() + Math.floor(Math.random() * 100))
      }).then(data => {
        if (data.code && '00' === data.code) {
          //console.log('getshare success')
          this.wxInit(data.result)
        }
      })
    },
    mounted() {
      //console.log(wx);
    },
    wxInit(sd) {
      // console.log('wxInit', sd);
      // console.log(wx);
      let _this = this;
      wx.config({
        debug: false,
        appId: sd.appId,
        timestamp: sd.timestamp,
        nonceStr: sd.nonceStr,
        signature: sd.signature,
        jsApiList: [
          'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'checkJsApi', 'openLocation', 'getLocation'
        ]
      });
      wx.ready(function () {
        if (_this.shareHidden) {
          wx.hideMenuItems({
            menuList: ['menuItem:share:timeline', 'menuItem:copyUrl', 'menuItem:share:appMessage', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:favorite', 'menuItem:share:facebook', 'menuItem:share:QZone', 'menuItem:editTag', 'menuItem:delete', 'menuItem:copyUrl', 'menuItem:originPage', 'menuItem:readMode', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:share:brand'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
          });
          return false
        }
        if (_this.getLocation1) {
          wx.getLocation({
            success: function (res) {
              _this.pointY = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              _this.pointX = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            },
            fail:function(res){
              console.log(res)
            },
            cancel: function (res) {
              console.log('用户拒绝授权获取地理位置');
            }
          });


        }
        wx.onMenuShareTimeline({
          title: _this.shareTitle, // 分享标题
          desc: _this.shareDesc, // 分享描述
          link: _this.shareLink, // 分享链接
          imgUrl: _this.shareImgUrl, // 分享图标
          success: function () {
            // alert("分享到朋友圈成功")
            // Toast({
            //   message: "成功分享到朋友圈"
            // });
          },
          cancel: function () {
            // alert("分享失败,您取消了分享!")
            // Toast({
            //   message: "分享失败,您取消了分享!"
            // });
          }
        });
        //微信分享菜单测试
        wx.onMenuShareAppMessage({
          title: _this.shareTitle, // 分享标题
          desc: _this.shareDesc, // 分享描述
          link: _this.shareLink, // 分享链接
          imgUrl: _this.shareImgUrl, // 分享图标
          success: function () {
            // alert("成功分享给朋友")
            // Toast({
            //   message: "成功分享给朋友"
            // });
          },
          cancel: function () {
            // alert("分享失败,您取消了分享!")
            // Toast({
            //   message: "分享失败,您取消了分享!"
            // });
          }
        });

        wx.onMenuShareQQ({
          title: _this.shareTitle, // 分享标题
          desc: _this.shareDesc, // 分享描述
          link: _this.shareLink, // 分享链接
          imgUrl: _this.shareImgUrl, // 分享图标
          success: function () {
            // alert("成功分享给QQ")
            // Toast({
            //   message: "成功分享到QQ"
            // });
          },
          cancel: function () {
            // alert("分享失败,您取消了分享!")
            // Toast({
            //   message: "分享失败,您取消了分享!"
            // });
          }
        });
        wx.onMenuShareWeibo({
          title: _this.shareTitle, // 分享标题
          desc: _this.shareDesc, // 分享描述
          link: _this.shareLink, // 分享链接
          imgUrl: _this.shareImgUrl, // 分享图标
          success: function () {
            // alert("成功分享给朋友")
            // Toast({
            //   message: "成功分享到腾讯微博"
            // });
          },
          cancel: function () {
            // alert("分享失败,您取消了分享!")
            // Toast({
            //   message: "分享失败,您取消了分享!"
            // });
          }
        });
        wx.onMenuShareQZone({
          title: _this.shareTitle, // 分享标题
          desc: _this.shareDesc, // 分享描述
          link: _this.shareLink, // 分享链接
          imgUrl: _this.shareImgUrl, // 分享图标
          success: function () {
            // alert("成功分享给朋友")
            // Toast({
            //   message: "成功分享到QQ空间"
            // });
          },
          cancel: function () {
            // alert("分享失败,您取消了分享!")
            // Toast({
            //   message: "分享失败,您取消了分享!"
            // });
          }
        });
      });
      wx.error(function (res) {
        // alert(JSON.stringify(res))
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    },
  }
}
