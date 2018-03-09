import MyCommunityItem from './MyCommunityItem'

MyCommunityItem.install = function (Vue) {
  Vue.component(MyCommunityItem.options.name, MyCommunityItem)
}

export default MyCommunityItem
