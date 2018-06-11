export default {
  musicListener: function (state) {
    return state.musicListener
  },
  musicList: function (state) { // 播放列表
    return state.musicList
  },
  playList: function (state) { // 播放列表
    return state.playList
  },
  curMusic:  function (state) { // 当前播放音乐
    return state.curMusic
  },
  isLastPage:  function (state) { // 是否有下一页
    return state.isLastPage
  },
  curIndex:  function (state) { // 序号
    return state.curIndex
  },
  isPreload:  function (state) { // 是否需要预加载
    return state.isPreload
  },
  prevMusic:  function (state) { // 上一个播放音乐
    return state.prevMusic
  },
  musicPlay: function (state) { // 播放状态
    return state.musicPlay
  },
  musicTotalTime: function (state) {  // 播放总时长
    return state.musicTotalTime
  },
  musicStatus: function (state) { // 音频状态
    return state.musicStatus
  },
  musicCurrentTime: function (state) {  // 当前播放时间
    return state.musicCurrentTime
  },
  musicPercentage: function (state) {  // 当前播放进度
    return state.musicPercentage
  },
  musicBufferTime: function (state) { // 已缓冲时间
    return state.musicBufferTime
  },
  musicStripImg: function (state) { // 播放条图片
    return state.musicStripImg
  },
  musicCurrentId: function (state) {  // 当前播放音频Id
    return state.musicCurrentId
  },
  musicCurrentIndex: function (state) { // 当前播放音频在列表中的下标
    return state.musicCurrentIndex
  },
  musicCurrent: function (state) {  // 当前音频对象
    return state.musicCurrent
  },
  musicIsPrev: function (state) { // 是否有上一首
    state.musicIsPrev = state.musicCurrentIndex > 0
    return state.musicIsPrev
  },
  musicIsNext: function (state) { // 是否有下一首
    state.musicIsNext = state.musicCurrentIndex < state.musicList.length - 1
    return state.musicIsNext
  },
  musicType: function (state) { // 小课: 1 或 听书: 2
    return state.musicType
  },
  musicImmediately: function (state) {  // 是否立即播放
    return state.musicImmediately
  },
  musicFastSeekPercentage: function (state) { // 进度跳转
    return state.musicFastSeekPercentage
  },
  musicLoading: function (state) { // 缓冲状态
    return state.musicLoading
  },
  musicOff: function (state) { // 是否已下架
    return state.musicOff
  }
}
