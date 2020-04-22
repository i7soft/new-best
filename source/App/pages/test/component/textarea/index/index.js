Page({
  data: {
    focus: false,
    value:'bobo\n\n\n\n\n\n\n\n\n'
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
  },
  aaa:function(e){
    console.log(e);
  },
  setValue:function(){
    this.setData({value:'mimi'})
  },
  setFocus:function(){
    this.setData({focus:true})
  }
})
