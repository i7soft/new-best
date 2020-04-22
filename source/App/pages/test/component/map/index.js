Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    controls:[{
      id:9,
      clickable:true,
      position:{
          left:0,
          top:0,
          width:200,
          height:200
      },
      iconPath:'/__NB__/images/marker.png'
  }],
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园',
      autoRotate:true,
      label:{
        content:'bobo',
        
    }
    },{
      // id:2,
      latitude: 23.098894,
      longitude: 113.322420,
      title: 'T.I.T 创意园2',
      callout: {
          content: 'http://tpc.googlesyndication.com/simgad/5843493769827749134\n地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里',
          bgColor: '#ff0000',
          borderWidth: 10,
          borderColor: '#00ff00',
          // display:'ALWAYS',
          borderRadius:10
      }
  }],
  polygons:[
    {
      points:[
        {latitude: 39.920255, longitude: 116.403322},
        {latitude: 39.897555, longitude: 116.410703},
        {latitude: 39.892353, longitude: 116.402292},
        {latitude: 39.891365, longitude: 116.389846}
      ],
      strokeWidth:10,
      strokeColor:'#ff000080',
      fillColor:'#00ff0060'
    },
  ],
  polyline: [
    {
        points: [
            {
                latitude: 23.099994,
                longitude: 113.324520
            },
            {
                latitude: 23.098894,
                longitude: 113.322420
            }
        ],
        color: '#ff000050',
        width: 20,
        borderColor: '#00ff00',
        borderWidth: 5,
        arrowLine: true
    }
],
  circles:[
    {
      latitude: 23.098894,
      longitude: 113.322420,
      color:'#ff0000',
      strokeWidth:3,
      radius:50,
      fillColor:'#00ff00',

    }
  ],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/image/location.png'
    }]
  },
  changeMarker:function(){
    this.setData({
      controls:[{
        id:9,
        clickable:true,
        position:{
            left:0,
            top:0,
            width:200,
            height:200
        },
        iconPath:'/__NB__/images/marker2.png'
    }],
      polygons:[
        // {
        //   points:[
        //     {latitude: 39.920255, longitude: 116.403322},
        //     {latitude: 39.897555, longitude: 116.410703},
        //     {latitude: 39.892353, longitude: 116.402292},
        //     {latitude: 39.891365, longitude: 116.389846}
        //   ],
        //   strokeWidth:3,
        //   strokeColor:'#ff000080',
        //   fillColor:'#00ff60'
        // },
        // {
        //   points:[
        //     {latitude: 39.910055, longitude: 116.401322},
        //     {latitude: 39.817455, longitude: 116.410103},
        //     {latitude: 39.812253, longitude: 116.402192},
        //     {latitude: 39.821265, longitude: 116.389146}
        //   ],
        //   strokeWidth:3,
        //   strokeColor:'#ff000080',
        //   fillColor:'#00ff6020'
        // },
      ],
      polyline: [
      //   {
      //       points: [
      //           {
      //               latitude: 23.099994,
      //               longitude: 113.324520
      //           },
      //           {
      //               latitude: 23.098894,
      //               longitude: 113.322420
      //           }
      //       ],
      //       color: '#ff0000',
      //       width: 10,
      //       borderColor: '#00ff00',
      //       borderWidth: 5,
      //       arrowLine: true
      //   },
      //   {
      //     points: [
      //         {
      //             latitude: 23.098994,
      //             longitude: 113.324520
      //         },
      //         {
      //             latitude: 23.097894,
      //             longitude: 113.322420
      //         }
      //     ],
      //     color: '#ff0000',
      //     width: 10,
      //     borderColor: '#00ff00',
      //     borderWidth: 5,
      //     arrowLine: true
      // }
    ],
      circles:[
        // {
        //   latitude: 23.098894,
        //   longitude: 113.322420,
        //   color:'#00ff00',
        //   strokeWidth:1,
        //   radius:100,
        //   fillColor:'#ff0',
    
        // }
      ],
      markers: [{
        id: 1,
        latitude: 23.099894,
        longitude: 113.324920,
        name: 'T.I.T 创意园2',
      //   callout: {
      //     content: 'bobo',
      //     display:'ALWAYS'
      // }
      }
      ,{
        id:2,
        latitude: 23.098894,
        longitude: 113.322420,
        title: 'T.I.T 创意园2',
        callout: {
            content: 'http://tpc.googlesyndication.com/simgad/5843493769827749134\n地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里',
            bgColor: '#ff0000',
            borderWidth: 10,
            borderColor: '#00ff00',
            display:'ALWAYS',
            borderRadius:10
        }
    },
      {
        id:3,
        latitude: 23.097894,
        longitude: 113.322420,
        // callout: {
        //     content: 'shiqiren',
        //     bgColor: '#ff0000',
        //     borderWidth: 3,
        //     borderColor: '#00ff00',
        //     borderRadius:10
        // }
      }
    ]
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })

    this.mapCtx.getRegion({
      success: function (res) {
          console.log(res)
      }
  });

  this.mapCtx.getScale({
    success: function (res) {
        console.log(res)
    }
});
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: false,
      rotate:45,
      duration: 1000,
      destination: {
        latitude:23.10229,
        longitude:113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:23.10229,
        longitude:113.3345211,
      }, {
        latitude:23.00229,
        longitude:113.3345211,
      }]
    })
  },
    aaa: function (e) {
        console.log(e);
    },
    record:function(){
        wx.onSocketOpen(function(){
            console.log(1);
        });
        wx.onSocketOpen(function () {
            console.log(2);
        });
       
        var a = wx.connectSocket({
            url: '192.168.1.250:808'
        });

        console.log(a);

        a.onOpen(function(){
            console.log(1);
        })

        a.onOpen(function () {
            console.log(2);
        })
    }
})
