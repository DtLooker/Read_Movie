var util = require('../../utils/util.js');
var app = getApp();
Page({

    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow:true,
        searchPanelShow:false,
    },

    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    onMoreTap:function(event){
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
        })
    },

    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx: wx.request({
            url: url,
            header: {
                //不加header将会报错， 
                //用"Content-Type":"application/json"或者"Content-Type":""
                "Content-Type": "json"
            },
            method: 'GET',
            success: function (res) {
                console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function (res) {
                console.log("failed");
            },
        })
    },

    onCancelImgTap:function(event){
        this.setData({
            containerShow:true,
            searchPanelShow:false,
        })
    },

    onBindFocus: function (event) {
        //console.log("show search");
        this.setData({
            containerShow:false,
            searchPanelShow:true
        })
    },

    onBindConfirm: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
        var readyData = {};
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        };
        this.setData(readyData);
    },

})