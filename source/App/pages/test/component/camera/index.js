Page({
  data:{
  	devicePosition:'back'
  },
  onLoad() {
    this.ctx = wx.createCameraContext();
	const listener = this.ctx.onCameraFrame((frame) => {
       console.log(new Date());
       console.log(frame.data, frame.width, frame.height);
	   listener.stop();
   });
   listener.start();
  },
  changeCamera(){
  	this.setData({
  	  devicePosition: this.data.devicePosition=='back'?'front':'back'
  	})
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      },
      complete:function(e){
          console.log(e)
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      },
	  fail:(res)=>{
	  	console.log(res.errMsg);
	  	},
	  	timeoutCallback:(res)=>{
	  		this.setData({
	  		  src: res.tempThumbPath,
	  		  videoSrc: res.tempVideoPath
	  		})
	  	}
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  aaa:function(e){
	  this.setData({
	  	  scanResult: e.detail.result
	  	})
      console.log(e.detail);
  }
})