import * as types from './mutations_types'

export default {
  /**
   * 更新播放列表
   * @param commit
   * @param data          列表(必传)
   * @param type          类型(必传)
   * @param id            音频ID(非必传)
   * @param immediately   是否立即播放(非必传)
   * @returns {Promise}
   */
  update_musicList: ({commit}, {data, type, id, immediately}) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICLIST, {data, type, id, immediately})
      resolve()
    })
  },
  // 播放音乐
  music_play: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICPLAY, true)
      resolve()
    })
  },
  // 暂停音乐
  music_pause: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICPLAY, false)
      resolve()
    })
  },
  // 切换音频
  music_update: ({commit}, {index, id, err, immediately}) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSIC, {index, id, err, immediately: immediately})
      resolve()
    })
  },
  // 更新播放总时长
  update_music_totalTime: ({commit}, totalTime) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICTOTALTIME, totalTime)
      resolve()
    })
  },
  // 更新播放状态
  update_music_status: ({commit}, status) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICSTATUS, status)
      resolve()
    })
  },
  // 更新播放当前时间
  update_music_currentTime: ({commit}, currentTime) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICCURRENTTIME, currentTime)
      resolve()
    })
  },
  // 更新已缓冲时长
  update_music_bufferTime: ({commit}, bufferTime) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICBUFFERTIME, bufferTime)
      resolve()
    })
  },
  // 更新播放进度
  update_music_fastSeekPercentage: ({commit}, percentage) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICFASTSEEK, percentage)
      resolve()
    })
  },
  // 更新缓冲状态
  update_music_loading: ({commit}, loading) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICLOADING, loading)
      resolve()
    })
  },
  // 更新下架状态
  update_music_off: ({commit}, status) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_MUSICOFF, status)
      resolve()
    })
  }

}
