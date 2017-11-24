// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
  },

  onReady: function(options) {
    wx.setNavigationBarTitle({
        title: this.data.navigateTitle,
    })
  }
})