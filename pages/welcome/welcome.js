Page({
  onTap: function () {
    // 跳转页面的方法navigateTo(),跳转页面即为其子页面。子页面与父页面关系（最多五级）
   // wx.navigateTo({
     // url: '../posts/post',
    //});

    //跳转页面redirectTo(),页面跳转，平级跳转。平级关系
    //要跳转到一个带tab的选项卡页面，必须使用wx.switchTab方法，跳转到不带tab的卡页面还是redirect或者navigate
     wx: wx.switchTab({
       url: '../posts/post',
       // success: function(res) {},
       // fail: function(res) {},
       // complete: function(res) {},
     })
    

  },


})