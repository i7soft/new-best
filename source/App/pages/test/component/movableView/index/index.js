Page({
  data: {
    x: 0,
    y: 1000,
    scale: 2,
  },
  tap(e) {
    this.setData({
      x: 30,
      y: 30
    })
  },
  tap2() {
    this.setData({
      scale: 3
    })
  },
  onChange(e) {
    // console.log(e.detail)
  },
  onScale(e) {
    // console.log(e.detail)
  },
  touchmove(e){
    console.log(e);
  },
  vtouchmove(e){
    console.log(e)
  },
  htouchmove(e){
    console.log(e)
  }
})