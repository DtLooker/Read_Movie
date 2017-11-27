var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

    data: {
        isPlayingMusic: false
    },

    onLoad: function (option) {
        var globalData = app.globalData;
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];

        this.setData({
            postData: postData
        });


        var postsCollected = wx.getStorageSync('posts_collected');
        //第一次，没被收藏。为空
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            });
        }
        this.setAudioMonitor();
    },

    setAudioMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });

        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });

        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap: function (event) {
        // this.getPostsCollectedAsy();
        this.getPostsCollectedSyc();
    },

    //同步操作
    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏变成未收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },

    //异步操作
    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            },
        })
    },

    showToast: function (postsCollected, postCollected) {
        //更新文章是否为缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量,从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消成功',
            duration: 1000,
            icon: 'success'
        })
    },

    onShareTap: function (event) {
        //删除单个缓存
        // var game = wx.removeStorage({
        //   key: 'key'
        // })
        //删除所有缓存
        //var game = wx.clearStorageSync();

        var itemList = [
            '分享到微信',
            '分享到朋友圈',
            '分享到QQ',
            '分享到微博'
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                //res.cancel 用户是不是点击了取消按钮
                //res.tapIndex数组元素的序号，从0开始
                wx.showModal({
                    title: "用户 " + itemList[res.tapIndex],
                    content: "用户是否取消?" + res.cancel + "现在无法实现",
                })
            }
        })
    },

    onMusicTap: function () {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                //coverImgUrl只能在真机上显示
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }

})