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
        requestUrl: "",
        totalCount: 0,
        isEmpty: true,
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

    //onScrollLower:function(event){
    onReachBottom: function(event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);

        //wx.showNavigationBarLoading();
        wx.showLoading({
            title: '正在玩命加载中...',
        })
    },

    onPullDownRefresh: function(event){
        var refreshUrl = this.data.requestUrl + "?star=0&count=20";
        this.data.movies = [];
        this.data.isEmpty = true;
        this.data.totalCount = 0;
        util.http(refreshUrl, this.processDoubanData);
        
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
        var totalMovies = {};

        //要绑定旧的数据，就要和新的数据绑定在一起
        if(!this.data.isEmpty){
            totalMovies = this.data.movies.concat(movies);
        }else{
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies : totalMovies
        });
        this.data.totalCount += 20;
        wx.hideLoading();
        wx.stopPullDownRefresh();
    },  

    onReady: function (options) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    },

    onMovieTap: function (event){
        var movieId = event.currentTarget.dataset.movied;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,
        })
    }
})