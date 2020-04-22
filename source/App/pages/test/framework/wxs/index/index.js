const app = getApp()

Component({

  properties: {
    paramA: Number,
    paramB: String,
  },
  data:{
    aaa:1,
    animationData: {}
  },

  methods: {
    onLoad: function (e) {
      console.log(this);
      console.log(this.data);
      console.log(e);
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值
      // this.setData({ paramA:1000})
      // console.log(this.data);

      const animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })
  
      this.animation = animation
  
      animation.scale(2, 2).rotate(45).step()
  
      this.setData({
        animationData: animation.export()
      })
    }
  }

})