module.exports = Behavior({
  data: {
    from: 'beh7'
  },
  behaviors: [],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh7 definitionFilter', defFields.data.from, definitionFilterArr);

    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})