// my-behavior.js
module.exports = Behavior({
    behaviors: [],
    properties: {
      myBehaviorProperty: {
        type: String
      }
    },
    data: {
      myBehaviorData: {},
      list:[1,3,4],
      aaa: {
        a: 1,
        b:2
      }
    },
    attached: function () { console.log(2)},
    methods: {
      myBehaviorMethod: function () {
        console.log('log from my-behavior.js')
      }
    }
  })