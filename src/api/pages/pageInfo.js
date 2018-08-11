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

// 用户社区角色信息
//export const getRoleInfoApi = (data) => {
//return request({
//  url: '/wap/beacon/roleInfo',
//  data,
//  isLoading: true
//})
//}

// 大咖介绍页
export const getCommunityInfoApi = ({communityId, data}) => {
  return request({
    url: '/wap/beacon/' + communityId,
    data,
    type: 'get',
    isLoading: true
  })
}

// 获取角色区分
export const getRoleInfoApi = (data) => {
  return request({
    url: '/wap/beacon/roleInfo',
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

// 点赞列表
export const getFavorListApi = (data) => {
  return request({
    url: '/wap/currency/favorList',
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
    isLoading: false
  })
}

// 朋友圈详情
export const getCircleDetailApi = (data) => {
  return request({
    url: '/wap/beacon/circleInfo',
    data,
    isLoading: false
  })
}

// 帖子详情
export const getPostDetailApi = (data) => {
  return request({
    url: '/wap/post/detail',
    data,
    isLoading: false
  })
}

// 评论详情
export const getCommentDetailApi = (data) => {
  return request({
    url: '/wap/comment/info',
    data,
    isLoading: true
  })
}

// 发现内容详情
export const getExploreDetailApi = (data) => {
  return request({
    url: '/wap/beacon/selectionDetails',
    data,
    isLoading: true
  })
}

// 发现内容评论列表
export const getExploreCommentsApi = (data) => {
  return request({
    url: '/wap/comment/geComments',
    data,
    isLoading: true
  })
}
// 新发现内容评论列表
export const getNewExploreCommentsApi = (data) => {
  return request({
    url: '/wap/comment/list',
    data,
    isLoading: true
  })
}
// 统计接口
export const countCodeApi = (data) => {
  return request({
    url: '/wap/beacon/accessRecord',
    data,
  })
}

export const newCountCodeApi = (data) => {
  return request({
    url: '/wap/currency/messageAccessRecord',
    data,
  })
}
// 分销排行榜
export const rankingApi = (data) => {
  return request({
    url: '/wap/beacon/ranking',
    data,
  })
}

// 获取当前登录用户的权限和角色身份
export const userJurisdictionApi = (data) => {
  return request({
    url: '/docs/show/983',
    data,
  })
}

// 获取社区音频列表
export const musicListApi = (data) => {
  return request({
    url: '/wap/beacon/circleManages',
    data,
  })
}

// 高考活动页面
export const gaokaoApi = (data) => {
  return request({
    url: '/wap/special/gaoKaoPosterSetUserInfo',
    data,
  })
}

// 优惠信息接口
export const couponsApi = (couponid) => {
  return request({
    url: '/wap/coupon/'+couponid,
    type:'get',
  })
}

// 优惠券领取
export const couponReceiveApi = (couponid) => {
  return request({
    url: '/wap/coupon/receive/'+couponid,
    type:'post',
  })
}

// 个人中心展示列表优惠券列表
export const couponListApi = (data) => {
  return request({
    url: '/wap/coupon/userCoupons',
    type:'post',
    data,
  })
}

    
// 置顶
export const addTopApi = (data) => {
  return request({
    url: '/wap/post/addTop',
    data,
  })
}

// 优惠券兑换码兑换接口
export const RedemptionCodeApi = (coupon_code) => {
  return request({
    url: '/wap/coupon/codeReceive/'+coupon_code,
    type:'post',
  })
}

// 优惠券可选择列表
export const canUseCouponsApi = (data) => {
  return request({
    url: '/wap/coupon/canUseCoupons',
    type:'post',
    data
  })
}

// 优惠券不可使用择列表
export const invalidCouponsApi = (data) => {
  return request({
    url: '/wap/coupon/cantUseCoupons',
    type:'post',
    data
  })
}

// 课节详情内容
export const lessonContentApi = (data) => {
  return request({
    url: '/wap/course/1',
    type:'get',
    data
  })
}

// 课节详情内容
export const getCourseCardListApi = (communityId,courseId) => {
  return request({
    url: `/wap/courseCard/getCourseCardList/${communityId}/${courseId}`,
    type:'get'
  })
}

// 打卡内容点赞
export const courseCardFavorApi = (data) => {
  return request({
    url: `/wap/courseCard/courseCardFavor`,
    type:'post',
    data
  })
}
// 取消置顶
export const delTopApi = (data) => {
  return request({
    url: '/wap/post/delTop',
    data,
  })
}

// 删除帖子
export const deltePostApi = (data) => {
  return request({
    url: '/wap/beacon/commonDel',
    data,
  })
}

// 置顶帖子列表
export const topPostListApi = (data) => {
  return request({
    url: '/wap/post/topPostList',
    data,
  })
}

// 推荐
export const getRecommendApi = (data) => {
  return request({
    url: '/wap/beacon/recommend',
    data,
  })
}

// 推荐
export const getLessMsgApi = (data) => {
  return request({
    type: 'get',
    url: `/wap/beacon/community/${data.id}/courses`,
    data,
  })
}
