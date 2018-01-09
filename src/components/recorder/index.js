import Recorder from './Recorder'

Recorder.install = function (Vue) {
  Vue.component(Recorder.options.name, Recorder)
}

export default Recorder
