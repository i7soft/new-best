module.exports = Behavior({
  data: {
    from: 'beh4'
  },
  behaviors: [],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh4 definitionFilter', defFields.data.from, definitionFilterArr);

    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})