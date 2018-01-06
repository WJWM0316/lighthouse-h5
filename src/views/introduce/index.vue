<template>
  <div class="big-shot-introduce">
    <dynamic :dynamicList="dynamicList"
             :hideCommentArea="false"
             :showDelBtn="true"
             :showIdentification="false"
             :showLightHouseInfo="false"
    ></dynamic>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import dynamic from '@/components/dynamic/dynamic'

  @Component({
    name: 'big-shot-introduce',
    components: {
      dynamic
    }
  })
  export default class introduce extends Vue {
    dynamicList = []
    created () {
      this.dynamicList.push({
        circleId: '1233214578321',
        content: '这是一条朋友圈信息 - 纯文本',
        circleType: 0, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        modelType: 'post',
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        Lighthouse: '毛爷爷的社区',
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 音频1',
        circleType: 1, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        musicState: 0,
        progress: 0,
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
            fileName: '',
            size: 1000,
            duration: 5,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 音频2',
        circleType: 1, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        musicState: 0,
        progress: 0,
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
            fileName: '',
            size: 1000,
            duration: 5,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 视频',
        circleType: 2, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 单张大图',
        circleType: 3, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 4格图',
        circleType: 3, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date('2017-12-30').getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 9宫图',
        circleType: 3, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 文件',
        circleType: 4, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        problemId: '',
        content: '黑猫白猫，抓到老鼠就是好猫',
        modelType: 'problem',
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '邓小弟',
          avatar: 'http://i4.itc.cn/20081221/2b4_c48dd548_2ade_4c88_bedb_2ec9f0218d07_0.jpg'
        },
        answers: [ // 资源文件
          {
            answerId: '123',
            answerType: 2,
            type: 2,
            musicState: 0,
            progress: 0,
            content: '是吗?',
            duration: '',
            file: {
              fileId: '',
              fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
              fileName: '',
              size: '',
              duration: 5,
              isPlayed: false
            },
            releaseUser: {
              userId: '110',
              realName: '毛泽东',
              avatar: 'http://img.mp.sohu.com/q_mini,c_zoom,w_640/upload/20170721/2aedb89280c042a182cb56e094461437_th.jpg'
            }
          },
          {
            answerId: '124',
            answerType: 1,
            type: 1,
            content: '不是吗?'
          },
          {
            answerId: '125',
            answerType: 2,
            type: 2,
            musicState: 0,
            progress: 0,
            file: {
              fileId: '',
              fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
              fileName: '',
              size: '',
              duration: 5,
              isPlayed: false
            },
            releaseUser: {
              userId: '110',
              realName: '毛泽东',
              avatar: 'http://img.mp.sohu.com/q_mini,c_zoom,w_640/upload/20170721/2aedb89280c042a182cb56e094461437_th.jpg'
            }
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ]
      })
    }
  }
</script>

<style lang="less" scoped>
  .big-shot-introduce {
    padding-bottom: 108px;

    & .header {
    }

    & .container {
      margin-top: 40px;
    }

    & .module {

      &.h5-code {
      }

      .module-title {
        margin: 0 30px;
        font-size: 36px;
        color: #929292;
        font-weight: 500;

        & text {
          display: block;
          padding: 60px 0 20px;
        }
      }
      .module-content {

        &.h5-code {
          padding: 0 30px;
          font-size: 30px;
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;

          & img {
            max-width: 100% !important;
          }
        }
      }

      & .hr {
        height: 1px;
        background: #dcdcdc;
      }

      & .desc {
        color: #bcbcbc;
        font-size: 26px;
        padding: 40px 0;
        text-align: center;
      }
    }

    & .footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 108px;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bcbcbc;
      z-index: 999;

      & text {
        font-size: 30px;
      }

      & .time-clock {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #ffffff;
        box-shadow: 0 -1px 0 0 #dcdcdc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: #666666;
        & text:last-of-type {
          margin-left: 30px;
          color: #d7ab70;
        }
      }

      & form {
        flex-grow: 1;
        height:100%;
      }
      & button {
        flex-grow: 1;
        height: 100%;
        font-size: 26px;
        line-height: 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-style: none;
        border-radius: 0;
        border-top: solid 1px #dcdcdc;
        &:after {
          border-style: none;
        }

        & text {
          display: block;
          margin-top: 12px;
        }
        & text:first-of-type {
          margin-top: 0;
          font-size: 30px;
        }

        &.free-btn {
          color: #d7ab70;
          background-color: #ffffff;
        }
        &.pay-btn {
          color: #354048;
          background-color: #ffe266;
          & text:not(:first-of-type) {
            color: rgba(53, 64, 72, 0.8);
          }
        }
        &.free-btn-disable, &.pay-btn-disable {
          color: #bcbcbc;
        }
      }
    }

    .rich-text {
      display: block;
      max-width: 100%;
      line-height: 1.5;
      font-size: 32px;
      overflow: hidden;
    }
  }
</style>
