export default {
  isFirstClick: true,     // 针对ios 必须用户行为一次
  musicList: [],          // 播放列表        
  listener_loadstart: 0,  // 音频事件绑定
  listener_waiting: 0,
  listener_canplay: 0,
  listener_canplaythrough: 0,
  listener_timeupdate: 0,
  listener_ended: 0,
  listener_stalled: 0,
  isLastPage: true,      // 是否最后一页
  isPreload: false,       // 是否预先加载下一页
  curIndex: 0,             // 播放音频在列表中的位置
  curMusic: {
    fileId: '',
    filePath: '',
    playStatus: 1,
    index: 0,
    progress: 0,
    currentTime: 0,
    disabled: false,
    isShowLabel: false
  },           // 当前播放音乐
  prevMusic: {
    fileId: '',
    filePath: '',
    playStatus: 1,
    index: 0,
    progress: 0,
    currentTime: 0,
    disabled: false,
    isShowLabel: false
  },          // 上一个音乐
  musicPlay: false,       // 是否播放
  musicTotalTime: 0,      // 播放总时长
  musicOff: 0,            // 是否下架 0=>正常 1=>已下架
  musicStatus: 0,         // 播放状态
  musicLoading: false,     // 是否缓冲中
  musicType: 0,           // 歌曲类型 1=>课程 2=>书籍
  musicCurrentTime: 0,    // 播放当前时间
  musicPercentage: 0,     // 播放当前进度
  musicBufferTime: 0,     // 已缓冲时长
  musicCurrentId: '',     // 当前播放歌曲的id
  musicCurrentIndex: 0,   // 当前播放歌曲的index
  musicStripImg: '',      // 当前封面
  musicCurrent: {
    id: '',               // 歌曲id
    title: '',            // 标题名称
    sectionTitle: '',     // 章节名称
    name: '',             // 音频名称
    author: '',           // 作者
    url: '',
    type: '',             // 音频类型
    isTryListen: 0,       // 是否试听
    duration: 0,          // 总时长
    percentage: 0         // 播放百分比
  },
  musicFastSeekPercentage: 0,  // 跳转进度
  musicIsPrev: false,     // 是否有上一曲
  musicIsNext: false,
  musicImmediately: false, // 立即播放
  playList: {}
}
