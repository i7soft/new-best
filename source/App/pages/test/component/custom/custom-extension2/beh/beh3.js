module.exports = Behavior({
  data: {
    from: 'beh3'
  },
  behaviors: [require('./beh5')],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh3 definitionFilter', defFields.data.from, definitionFilterArr);
    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})