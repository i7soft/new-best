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
      console.log(this.data);
      console.log(e);
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值
      this.setData({ paramA:1000})
      console.log(this.data);
    }
  }

})