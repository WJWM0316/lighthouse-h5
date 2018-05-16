import selfDetail from './selfDetail'

selfDetail.install = function (Vue) {
  Vue.component(selfDetail.options.name, selfDetail)
}

export default selfDetail
