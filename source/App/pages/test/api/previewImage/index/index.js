const app = getApp()

Component({

  properties: {
    paramA: Number,
    paramB: String,
  },
  data:{
    aaa:1
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
    },
    tap1:function(){
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552969687631&di=e0cc9c175b4174bec9af7b5419c8dc77&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2F318a3b33b7bb93e4250aae9346f890f03505a700.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553506143938&di=bb81a1bbc583fc665e9f101b05338e52&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F5a649375e6ca5db152be8b5516d4f24e9123ca8759881-18fLHq_fw236',
          'https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h.jpg','https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg','https://farm4.staticflickr.com/3902/14985871946_24f47d4b53_h.jpg',
      'https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg',
    'https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg'] // 需要预览的图片http链接列表
      })
    }
  }

})