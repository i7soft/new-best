module.exports = Behavior({
  data: {
    from: 'beh2'
  },
  behaviors: [require('./beh5'),require('./beh8')],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh2 definitionFilter', defFields.data.from, definitionFilterArr);
    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})