Component({
  data:{
    a:{
      b:{
        c:0
      }
    },
    b:{
      b: {
        c: 0
      }
    }
  },
  observers: {
    'numberA, numberB': function (numberA, numberB) {
      this.setData({
        sum: numberA + numberB
      })
    },
    'a.b,b.b':function(a,b){
      console.log(a,b)
    }
  },
  created:function(){
    console.log('created');
  },
  methods:{
    onLoad: function () {
      console.log('onLoad');
    },
  },
  
  attached: function () {
    this.setData({
      numberA: 1,
      numberB: 2,
      'a.b.c':{
        b:{
          c:{
            d:1
          }
        }
      },
      b:'bobo'
    })
  }
})
