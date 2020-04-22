module.exports = Behavior({
  data: {
    from: 'beh'
  },
  behaviors: [require('./beh2'), require('./beh3')],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh definitionFilter', defFields.data.from, definitionFilterArr);
    defFields.data.from = defFields.data.from + '-addsome';
    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})