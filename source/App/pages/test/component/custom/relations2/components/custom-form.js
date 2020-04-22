var customFormControls = require('./custom-form-controls')
Component({
  relations: {
    'customFormControls': {
      type: 'descendant', // 关联的目标节点应为子孙节点
      target: customFormControls,
      linked: function(target) {
        console.info('已关联到 ' + target.is)
      }
    }
  }
})
