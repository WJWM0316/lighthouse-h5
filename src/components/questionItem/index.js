import QuestionItem from './QuestionItem'

QuestionItem.install = function (Vue) {
  Vue.component(QuestionItem.options.name, QuestionItem)
}

export default QuestionItem
