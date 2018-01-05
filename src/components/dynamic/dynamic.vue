<template>
  <!-- 朋友圈 -->
  <div class="dynamic-list">
    <dynamic-item v-for="item,index in dynamicList"
                  :item="item"
                  :key="index"
                  :hideCommentBtn="hideCommentBtn"
                  :hidePraiseBtn="hidePraiseBtn"
                  :showLightHouseInfo="showLightHouseInfo"
                  :showIdentification="showIdentification"
                  :showDelBtn="showDelBtn"
                  :hideBorder="hideBorder"
                  :hideCommentArea="hideCommentArea"
                  :disableContentClick="disableContentClick"
                  :disableUserClick="disableUserClick"
    ></dynamic-item>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamicItem from '@/components/dynamicItem/dynamicItem'

  @Component({
    name: 'dynamic-list',
    props: {
      // 是否隐藏评论按钮
      hideCommentBtn: {
        type: Boolean,
        'default': false
      },
      // 是否隐藏点赞按钮
      hidePraiseBtn: {
        type: Boolean,
        default: false
      },
      // 是否显示社区信息
      showLightHouseInfo: {
        type: Boolean,
        default: false
      },
      // 是否显示标识
      showIdentification: {
        type: Boolean,
        default: false
      },
      // 是否删除按钮
      showDelBtn: {
        type: Boolean,
        default: false
      },
      // 是否隐藏边框
      hideBorder: {
        type: Boolean,
        default: false
      },
      // 是否隐藏评论区域
      hideCommentArea: {
        type: Boolean,
        default: false
      },
      // 禁止内容点击事件
      disableContentClick: {
        type: Boolean,
        default: false
      },
      // 禁止头像名字点击
      disableUserClick: {
        type: Boolean,
        default: false
      }
    },
    components: {
      dynamicItem
    }
  })
  export default class dynamicList extends Vue {
    dynamicList = []

    created () {
      this.dynamicList.push({
        musicState: 0,
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
          avatar: ''
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
        musicState: 0,
        circleId: '',
        content: '这是一条朋友圈信息 - 音频',
        circleType: 1, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: ''
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
        musicState: 0,
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
          avatar: ''
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
        musicState: 0,
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
          avatar: ''
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
        musicState: 0,
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
          avatar: ''
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
        musicState: 0,
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
          avatar: ''
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
        musicState: 0,
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
          avatar: ''
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
    }
  }
</script>

<style lang="less" scoped>
  .m-community {
  }
</style>
