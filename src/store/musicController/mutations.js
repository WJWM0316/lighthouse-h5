import * as types from './mutations_types'
import browser from '@/util/browser/index'

/**
 * 播放列表转化
 * @param data   数据库返回的整个对象
 * @param type   类型
 * @returns {Array}
 */
function convertAudios (data, type) {
  let covertArr = []
  if (type === 1) {
    const audios = data.sections
    const courseId = data['course_id']
    if (audios && courseId) {
      audios.forEach(section => {
        let sectionTitle = section.section_name
        const sectionAudios = section.audios
        if (sectionAudios instanceof Array) {
          sectionAudios.forEach(audio => {
            let obj = {
              id: audio.id,             // 小节id
              type,
              title: data.course_name,  // 小课名称
              sectionTitle,             // 章节名称
              name: audio.name,         // 小节名称
              url: audio.path,
              duration: audio.duration, // 总时长
              currently: audio.playing_time,  // 上次播放时长
              courseId,                 // 小课id
              percentage: parseInt((audio.playing_time / audio.duration) * 100),  // 进度
              isTryListen: audio.is_try_listen,  // 是否试听
              manuscript: audio.manuscript       // 小节文稿
            }
            covertArr.push(obj)
          })
        }
      })
    }
  } else {
    const audio = data.audio
    if (audio) {
      const music = {
        id: audio.id,
        title: data.word_intro,
        type,
        bookId: data.voicebook_id,
        name: data.voicebook_name,
        url: audio.path,
        duration: audio.duration,
        currently: audio.playing_time,
        percentage: parseInt((audio.playing_time / audio.duration) * 100),
        isTryListen: 0
      }
      covertArr.push(music)
    }
  }
  return covertArr
}

export default {
  /**
   * 更新播放列表
   * @param state
   * @param musicList     播放列表数组
   * @param type          小课 or 听书
   * @param id            可指定播放id 不传则默认播放第一首
   * @param immediately   是否立即播放
   */
  [types.UPDATE_MUSICLIST] (state, {data, type = 1, id, immediately = false}) {
    const musicList = convertAudios(data, type)
    if (musicList && musicList.length > 0) {
      let item = {}
      let itemIndex = -1
      if (id) {
        musicList.forEach((val, index) => {
          if (val.id === id.toString()) {
            item = val
            itemIndex = index
          }
        })
        // 如果输入错误id 跳转到上次播放位置
        if (itemIndex < 0) return
      } else {
        item = musicList[0]
        itemIndex = 0
      }
      if (!data.is_bought && data.status) state.musicOff = 1
      state.musicType = type
      state.musicList = musicList
      state.musicCurrent = item
      state.musicPercentage = item.percentage
      state.musicCurrentTime = item.currently
      state.musicTotalTime = item.duration
      state.musicCurrentId = item.id
      state.musicCurrentIndex = itemIndex
      state.musicImmediately = immediately            // 是否立即播放
      if (browser.isIos() && state.isFirstClick && immediately) {    // 如果为ios设备 默认第一次进入为暂停
        state.musicPlay = false
        state.isFirstClick = false
      } else {
        state.musicPlay = immediately                 // 如果开启自动播放 则切换按钮状态
      }
      state.musicStripImg = data['cover_plan_player'] // 悬浮条展示图
    }
  },
  [types.UPDATE_PLAYLIST] (state, playList) {
    state.playList = playList
  },
  [types.UPDATE_MUSICPLAY] (state, musicPlay) {
    state.musicPlay = musicPlay
  },

  [types.UPDATE_CURMUSIC] (state, curMusic) {
    state.curMusic = curMusic
  },
  [types.UPDATE_ISLASTPAGE] (state, isLastPage) {
    state.isLastPage = isLastPage
  },
  [types.UPDATE_ISPRELOAD] (state, isPreload) {
    state.isPreload = isPreload
  },
  [types.UPDATE_CURINDEX] (state, curIndex) {
    state.curIndex = curIndex
  },
  [types.UPDATE_PREVMUSIC] (state, prevMusic) {
    state.prevMusic = prevMusic
  },
  [types.UPDATE_MUSICLISTENER] (state, musicListener) {
    state.musicListener = musicListener
  },
  /**
   * 切换歌曲
   * @param state
   * @param index 切换下标
   * @param id    切换对应id音频
   * @param err   错误回调
   * @param immediately 是否立即播放
   */
  [types.UPDATE_MUSIC] (state, {
    index = -1,
    id,
    err,
    immediately = false
  }) {
    let play = false
    if (!(index >= 0) && id) { // 如果传入是id
      state.musicList.forEach((val, i) => {
        if (val.id === id) {
          index = i
        }
      })
    }
    if (!(index >= 0)) {
      // 播放列表中不存在该ID
      state.musicPlay = play
      return
    }
    if (index < 0 || index > state.musicList.length - 1) {
      // 该位置不存在音频
      state.musicStatus = 8
      state.musicPlay = play
      return
    }
    let tempMusic = state.musicList[index]
    if (tempMusic.url) {
      // state.musicLoading = true
      state.musicPercentage = tempMusic.percentage
      state.musicCurrentTime = tempMusic.currently
      state.musicTotalTime = tempMusic.duration
      state.musicCurrent = tempMusic
      state.musicCurrentIndex = index
      state.musicCurrentId = state.musicCurrent.id
      state.musicImmediately = immediately
      play = immediately
    } else {
      // 该音频非试听
      state.musicStatus = 8
    }
    state.musicPlay = play
  },
  [types.UPDATE_MUSICTOTALTIME] (state, totalTime) {
    state.musicTotalTime = totalTime
  },
  [types.UPDATE_MUSICSTATUS] (state, status) {
    state.musicStatus = status
  },
  [types.UPDATE_MUSICCURRENTTIME] (state, currentTime) {
    let percentage = parseInt((currentTime / state.musicTotalTime) * 100)
    state.musicList[state.musicCurrentIndex].percentage = percentage
    state.musicList[state.musicCurrentIndex].currently = currentTime
    state.musicPercentage = percentage
    state.musicCurrentTime = currentTime
  },
  [types.UPDATE_MUSICBUFFERTIME] (state, bufferTime) {
    state.musicBufferTime = bufferTime
  },
  [types.UPDATE_MUSICFASTSEEK] (state, percentage) {
    state.musicList[state.musicCurrentIndex].currently = parseInt(percentage * 0.01 * state.musicTotalTime)
    state.musicFastSeekPercentage = percentage
    state.musicPercentage = percentage
    state.musicList[state.musicCurrentIndex].percentage = percentage
  },
  [types.UPDATE_MUSICLOADING] (state, loading) {
    state.musicLoading = loading
  },
  [types.UPDATE_MUSICOFF] (state, status) {
    state.musicOff = status
  }
}
