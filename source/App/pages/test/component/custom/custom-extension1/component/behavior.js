module.exports = Behavior({
  definitionFilter(defFields, definitionFilterArr) {
    console.log(1);
    defFields.data.from = 'behavior'
  },
})
