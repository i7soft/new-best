Component({
  data: {
    from: 'component'
  },
  behaviors: [require('../../beh/beh')],
  ready() {
    console.log('in component', this.data.from)
  }
})