Page({
  data: {
    current: {
      poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
      name: '此时此刻',
      author: '许巍',
      src: 'min总-你曾是少年.m4a',
    },
    audioAction: {
      method: 'pause'
    }
  },
  audioPlayed: function (e) {
    console.log(e);
    // console.log('audio is played')
  },
  audioTimeUpdated: function (e) {
    // console.log(e);
    this.duration = e.detail.duration;
  },

  timeSliderChanged: function (e) {
    if (!this.duration)
      return;

    var time = this.duration * e.detail.value / 100;

    this.setData({
      audioAction: {
        method: 'setCurrentTime',
        data: time
      }
    });
  },
  playbackRateSliderChanged: function (e) {
    this.setData({
      audioAction: {
        method: 'setPlaybackRate',
        data: e.detail.value
      }
    })
  },

  playAudio: function () {
//    this.setData({
//      audioAction: {
//        method: 'play'
//      }
//    });


// var ctx = wx.createInnerAudioContext();
//     ctx.src ='https://wm.rrtdc.cn/I7/debug/App/a.mp3';
// 	 ctx.startTime=60;
// 	 ctx.endTime=80;
// 	 ctx.loop=true;
//     ctx.onPause(function(e){
//         console.log('a',e);
//     });
//     ctx.onCanplay(function (e) {
//         console.log('b', e);
//     });
//     ctx.play();

	wx.playVoice({
     filePath: '/__NB__/audio/scanCode.mp3',
   })
//
//    setTimeout(() => { wx.stopVoice() }, 5000)

// wx.playBackgroundAudio({
//   dataUrl: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
//   title: '',
//   coverImgUrl: ''
// })
  },
  pauseAudio: function () {
    this.setData({
      audioAction: {
        method: 'pause'
      }
    });
  }
})