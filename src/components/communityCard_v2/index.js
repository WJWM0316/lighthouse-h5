import CommunityCard from './CommunityCard'

CommunityCard.install = function (Vue) {
  Vue.component(CommunityCard.options.name, CommunityCard)
}

export default CommunityCard
