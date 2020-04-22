module.exports = Behavior({
  data: {
    from: 'beh8'
  },
  behaviors: [],
  definitionFilter(defFields, definitionFilterArr) {
    console.log('beh8 definitionFilter', defFields.data.from, definitionFilterArr);

    definitionFilterArr.forEach(func => {
      func(defFields)
    })
  },
})