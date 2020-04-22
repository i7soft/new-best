// component.js
Component({
  data: {
    from: 'component'
  },
  behaviors: [require('behavior.js')],
  created:function(){
    console.log(2);
  },
  ready() {
    console.log('in component --> ', this.data.from)
  }
})
