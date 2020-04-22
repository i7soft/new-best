Page({
  data: {
    icon:[
      {
        size:20,
        type:[
          'success', 
          'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ]
      },
      {
        size:30,
        type:[
          'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ]
      },
      {
        size:40,
        type:[
          'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ]
      }
    ]
  },
  aaa:function(){
    this.setData({
      'icon[1].size':35,
      // 'icon[1]':{
      //   size:35,
      //   type:[
      //     'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
      //   ]
      // }
    })
  }
})