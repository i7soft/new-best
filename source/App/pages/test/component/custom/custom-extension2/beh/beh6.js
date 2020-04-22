module.exports = Behavior({
  data: {
    from: 'beh6'
  },
  behaviors: [require('./beh7')],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh6 definitionFilter', defFields.data.from, definitionFilterArr);

    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})