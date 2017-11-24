// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies:{},
        navigateTitle: "",
        requestUrl:"",
        totalCount:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        this.data.navigateTitle = category;

        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        //如果不写this关键字，    会报错 callBack is not defined;
        util.http(dataUrl, this.processDoubanData);
    },

    onScrollLower:function(event){
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    },

    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp);
        }
        this.data.totlaCount += 20;
        this.setData({
            movies : movies
        });
    },  

    onReady: function (options) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    }
})