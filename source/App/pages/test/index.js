Page({
  data: {
    list:[
      {a:1,b:1},
      {a:2,b:2},
      {a:3,b:3},
    ],
    objectArray: [
      { id: 5, unique: 'unique_5', data: { value: undefined } },
      { id: 4, unique: 'unique_4', data: { value: 0 } },
      { id: 3, unique: 'unique_3', data: { value: 0 } },
      { id: 2, unique: 'unique_2', data: { value: 0 } },
      { id: 1, unique: 'unique_1', data: { value: 0 } },
      { id: 0, unique: 'unique_0',data:{value:0} },
    ],
    numberArray: '0101',
    a: 1,
    b: 2,
    slot:'aaa',
    switch:true,
    import:'aa',
    template:'objectCombine',
    color:'#00ff00',
    animationData: {},
    class:'aaa'
  },
  onShow() {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.scale(2, 2).rotate(45).step()

    this.setData({
      animationData: animation.export()
    })

    // setTimeout(function () {
    //   animation.translate(30).step()
    //   this.setData({
    //     animationData: animation.export()
    //   })
    // }.bind(this), 1000)
  },
  changeList:function(){
    this.setData({
      list:[
        {a:3,b:3},
        {a:1,b:1},
        {a:2,b:2},
      ]
    })
  },
  switch: function (e) {
    var list=this.data.objectArray;
    list.push({ id: list.length, unique: 'unique_'+list.length,data:{value:1} });
    this.setData({
      'objectArray':list
    })
    // const length = this.data.objectArray.length
    // for (let i = 0; i < length; ++i) {
    //   const x = Math.floor(Math.random() * length)
    //   const y = Math.floor(Math.random() * length)
    //   const temp = this.data.objectArray[x]
    //   this.data.objectArray[x] = this.data.objectArray[y]
    //   this.data.objectArray[y] = temp
    // }
    // this.setData({
    //   objectArray: this.data.objectArray
    // })
  },
  addToFront: function (e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function (e) {
    this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  },
  aaa:function(){
    this.setData({'numberArray[0]':"1",slot:'bbb'});
    console.log(this.data.numberArray)
  },
  changeSwitch:function(){
    this.setData({switch: !this.data.switch });
  },
  onReady:function(){
    var query = wx.createSelectorQuery()
    query.selectAll('switch[color=#0000ff]').boundingClientRect(function (res) {
      console.log(res);
    });
    query.exec();

    // console.log(fuck);
  },
  setColor:function(){
    this.setData({color:'#ff0000',class:'aaa bbb'})
  },
  touchEvent:function(e){
    console.log(e);
  }
})