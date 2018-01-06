import {request} from '../require.js'

// 获取集call页面信息
export const getCallInfoApi = (data) => {
  return request({
    url: '/wap/call/getInfo',
    data,
    needUserInfo: false,
    isLoading: true
  })
}

// 点击打call
export const clickCallApi = (data) => {
  return request({
    url: '/wap/call/click',
    data,
    isLoading: true
  })
}

// 社区基本信息
export const getCommunityApi = (data) => {
  return request({
    url: '/wap/beacon/community',
    data,
    isLoading: true
  })
}

// 朋友圈
export const getCirclesApi = (data) => {
  return request({
    url: '/wap/beacon/circles',
    data,
    isLoading: true
  })
}

// 交流社区
export const getCommunicationsApi = (data) => {
  return request({
    url: '/wap/beacon/communications',
    data,
    isLoading: true
  })
}

// 个人详情
export const getPersonalDetailsApi = (data) => {
  return request({
    url: '/wap/my/personalDetails',
    data,
    isLoading: true
  })
}
// 朋友列表
export const classmatesApi = (data) => {
  return request({
    url: '/wap/beacon/classmates',
    data,
  })
}

// 提问详情
export const getAskInfoApi = (data) => {
  return request({
    url: '/wap/problem/getInfo',
    data,
    isLoading: true
  })
}

// 点赞
export const setFavorApi = (data) => {
  return request({
    url: '/wap/currency/favor',
    data,
    isLoading: true
  })
}

// 评论
export const setSubmitCommentApi = (data) => {
  return request({
    url: '/wap/comment/submitComment',
    data,
  })
}

// 删除
export const delCommontApi = (data) => {
  return request({
    url: '/wap/beacon/commonDel',
    data,
  })
}

// 提问
export const submitProblemApi = (data) => {
  return request({
    url: '/wap/problem/click',
    data,
    isLoading: true
  })
}

// 追问
export const submitAnswerApi = (data) => {
  return request({
    url: '/wap/problem/answer',
    data,
    isLoading: true
  })
}

// 播放音频
export const playAudioApi = (data) => {
  return request({
    url: '/wap/beacon/clicked',
    data,
    isLoading: true
  })
}

// ---------------------------------------------

// 获取评论列表
export const getCommentListApi = (data) => {
  return request({
    url: '/wap/comment/list',
    data,
    isLoading: true
  })
}

// 问题详情
export const getProblemDetailApi = (data) => {
  return request({
    url: '/wap/problem/detail',
    data,
    isLoading: true
  })
}

// 朋友圈详情
export const getCircleDetailApi = (data) => {
  return request({
    url: '/wap/beacon/circleInfo',
    data,
    isLoading: true
  })
}

// 帖子详情
export const getPostDetailApi = (data) => {
  return request({
    url: '/wap/post/detail',
    data,
    isLoading: true
  })
}

// 帖子详情
export const getCommentDetailApi = (data) => {
  return request({
    url: '/wap/comment/info',
    data,
    isLoading: true
  })
}