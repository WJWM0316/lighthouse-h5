import Scroller from './Scroller'

Scroller.install = function (Vue) {
  Vue.component(Scroller.options.name, Scroller)
}

export default Scroller
