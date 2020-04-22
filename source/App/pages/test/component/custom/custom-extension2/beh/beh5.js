module.exports = Behavior({
  data: {
    from: 'beh5'
  },
  behaviors: [require('./beh6')],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh5 definitionFilter', defFields.data.from, definitionFilterArr);

    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})