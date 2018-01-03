import ImageItem from './ImageItem'

ImageItem.install = function (Vue) {
  Vue.component(ImageItem.options.name, ImageItem)
}

export default ImageItem
