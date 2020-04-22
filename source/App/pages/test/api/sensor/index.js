// pages/test/api/Compass.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        res:{},
        res2:{},
		res3:{},
		res4:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        wx.onCompassChange(function (res) {
            // console.log('compass1')
            that.setData({res:res});
        })

        wx.onCompassChange(function (res) {
            // console.log('compass2')
        })

       
        wx.onAccelerometerChange(function (res) {
            that.setData({ res2: res });
        })

        wx.startAccelerometer({
//            interval: 'game'
        })
		
		wx.onDeviceMotionChange(function (res) {
            that.setData({ res3: res });
        })

        wx.startDeviceMotionListening({
//            interval: 'game'
        })
		
		wx.onGyroscopeChange(function (res) {
            console.log(res);
            that.setData({ res4: res });
        })

        wx.startGyroscope({
//            interval: 'game'
        })
		
		
		// setTimeout(function () {
		// 	wx.stopAccelerometer()
		// 	wx.stopCompass()
		// 	wx.stopDeviceMotionListening()
		// 	wx.stopGyroscope()
		// }, 10000)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})