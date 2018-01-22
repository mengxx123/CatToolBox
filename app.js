//app.js author:丢失的橘子
const api_key = require('utils/config.js').logistics_key;
const api_url = require('utils/config.js').logistics_address;
var Base64 = require('utils/base64.modified.js');
var MD5 = require('/utils/md5.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log("工具箱启动成功...")
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },

  getExpressInfo: function (nu, type, cb) {
    var apikey = "";
    var jsonData = {
      'LogisticCode': nu,
      'ShipperCode': type
    }

    var sign = JSON.stringify(jsonData) + apikey;
    console.log(sign)

    var DataSign = Base64.encode(MD5.hexMD5(sign));
    var RequestData = escape(JSON.stringify(jsonData));

    wx.request({
      url: "https://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx",
      data: {
        'EBusinessID': '1321315',
        'RequestData': RequestData,
        'RequestType': '1002',
        'DataSign': DataSign,
        'DataType': '2'
      },
      header: {

      },
      success: function (res) {
        cb(res.data)
      }
    })
  }
})