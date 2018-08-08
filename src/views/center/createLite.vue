<template>
  <div class="p-create-lite p-body">
    <p class="ft-sz" style="text-align: center;font-weight: normal;">norm去问al</p>
    <p class="ft-sz" style="text-align: center;font-weight: bold;">bol 请问d</p>
    <p class="ft-sz" style="text-align: center;font-weight: bolder;">bolde请问r</p>
    <p class="ft-sz" style="text-align: center;font-weight: lighter;">lighte 请问r</p>
    <p class="ft-sz" style="text-align: center;font-weight: 100;">100 请问</p>
    <p class="ft-sz" style="text-align: center;font-weight: 200;">200请问</p>
    <p class="ft-sz" style="text-align: center;font-weight: 300;">300请问</p>
    <p class="ft-sz" style="text-align: center;font-weight: 400;">400 请问饿</p>
    <p class="ft-sz" style="text-align: center;font-weight: 500;">500请问</p>
    <p class="ft-sz" style="text-align: center;font-weight: 600;">600请问</p>
    <p class="ft-sz" style="text-align: center;font-weight: 700;">700阿斯顿</p>
    <p class="ft-sz" style="text-align: center;font-weight: 800;">800阿斯顿</p>
    <p class="ft-sz" style="text-align: center;font-weight: 900;">900撒的</p>
    <p class="error-tips" v-if="form.status === 3">很抱歉您的资料未通过审核，请修改后重新提交</p>
    <div class="form">
      <div class="form-group flex">
        <label for="type"><span class="asterisk">*</span> 灯塔类别</label>
        <div class="control-container">
          <popup-picker ref="type" :show.sync="showTypePopupPicker" :show-cell="false" :data="types" v-model="form.type" @on-hide="handleTypePopupPickerHide"></popup-picker>
          <input type="text" id="type" class="control" placeholder="请选择灯塔类型" :value="typeText" readonly @click="handleShowTypePopupPicker" :disabled="form.status === 1">
        </div>
      </div>
      <div class="form-group flex">
        <label for="title"><span class="asterisk">*</span> 灯塔标题</label>
        <div class="control-container">
          <input type="text" id="title" class="control" :maxlength="30" placeholder="例如：走向百万年薪之类" v-model="form.title" :disabled="form.status === 1">
        </div>
      </div>
      <div class="form-group">
        <label for="advantage"><span class="asterisk">*</span> 您的优势</label>
        <div class="control-container">
          <textarea id="advantage" class="control" rows="5" :maxlength="1000" placeholder="请尽量说明您的优势，例如您有怎样的行业或项目经历？获得过什么样的殊荣？" v-model="form.advantage" :disabled="form.status === 1"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="worth"><span class="asterisk">*</span> 灯塔价值</label>
        <div class="control-container">
          <textarea id="worth" class="control" rows="5" :maxlength="1000" placeholder="您想向学员传输什么样的话题或内容？学员都可以获得什么？" v-model="form.worth" :disabled="form.status === 1"></textarea>
        </div>
      </div>

      <p class="protocol">确定创建则代表您已确认并同意<router-link to="/center/protocolCreate">《创建灯塔协议》</router-link></p>

      <div class="contact">
        <label class="label"><span class="asterisk">*</span> 如有疑问，请联系顾问</label>
        <div class="contents">
          <p>顾问热线：020-2816 3063</p>
          <p>顾问微信号：zike03</p>
        </div>
      </div>
    </div>

    <div class="g-footer">
      <button type="button" class="submit u-btn" :disabled="form.status === 1" @click="handleSubmit" v-text="form.status === 1 ? '申请提交成功，正在审核' : '确定创建灯塔'"></button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import { PopupPicker } from 'vux'
import { getApplyCommunityApi, saveApplyCommunityApi } from '@/api/pages/center'
import { getTagsListApi } from '@/api/pages/home'

@Component({
  name: 'create-lite',
  components: {
    PopupPicker
  },
  watch: {
    'form.type': {
      handler (val) {
        const type = val[0]
        const types = this.types[0]
        types && types.forEach(item => {
          if (item.value === parseInt(type)) {
            this.typeText = item.name
          }
        })
      },
      deep: true,
      immediate: true
    }
  }
})
export default class CenterCreateLite extends Vue {
  form = {
    type: [], // 产品类型
    title: '', // 灯塔标题
    advantage: '', // 优势
    worth: '', // 价值
    status: 0 // 状态：0 => 未创建；1 => 待审核；2 => 审核通过；3 => 审核不通过；
  }

  // 产品分类列表
  types = []
  typeText = ''
  showTypePopupPicker = false

  created () {
    this.init()
  }

  /**
   * 初始化
   */
  async init () {
    try {
      this.$vux.loading.show({
        text: '加载中...'
      })
      const tags = await getTagsListApi({
        globalLoading: false
      })
      const types = []
      tags.forEach(item => {
        if (item.id !== 0) {
          types.push({
            name: item.tagName,
            value: item.id
          })
        }
      })
      this.types = [types]

      const res = await getApplyCommunityApi({
        globalLoading: false
      })
      this.form.type = [res.type || 0]
      this.form.title = res.title
      this.form.advantage = res.advantage
      this.form.worth = res.worth
      this.form.status = res.status || 0
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    } finally {
      this.$vux.loading.hide()
    }
  }

  /**
   * 提交
   */
  async submit () {
    try {
      if (this.validate()) {
        const params = this.transformData(this.form)
        await saveApplyCommunityApi(params)
        this.$vux.toast.text('提交成功', 'bottom')
        this.init()
      }
    } catch (error) {
      console.error(error)
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 转换数据为提交的格式
   * @param {*} data
   */
  transformData (data) {
    const newForm = Object.assign({}, data)
    newForm.type = newForm.type[0]
    delete newForm.status

    return newForm
  }

  /**
   * 验证数据
   * @return {Boolean}
   */
  validate () {
    let valid = true

    if (!this.form.type || this.form.type.length <= 0 || !this.form.type[0]) {
      this.$vux.toast.text('请选择灯塔类别', 'bottom')
      valid = false
    } else if (!this.form.title) {
      this.$vux.toast.text('请填写灯塔标题', 'bottom')
      valid = false
    } else if (this.form.title.length > 30) {
      this.$vux.toast.text('灯塔标题最多30个字', 'bottom')
      valid = false
    } else if (!this.form.advantage) {
      this.$vux.toast.text('请填写您的优势', 'bottom')
      valid = false
    } else if (this.form.advantage.length > 1000) {
      this.$vux.toast.text('你的优势最多1000个字', 'bottom')
      valid = false
    } else if (!this.form.worth) {
      this.$vux.toast.text('请填写灯塔价值', 'bottom')
      valid = false
    } else if (this.form.worth.length > 1000) {
      this.$vux.toast.text('灯塔价值最多1000个字', 'bottom')
      valid = false
    }

    return valid
  }

  /**
   * 点击提交
   */
  handleSubmit () {
    this.submit()
  }

  /**
   * 选择灯塔类型
   */
  handleShowTypePopupPicker () {
    this.showTypePopupPicker = true
  }

  /**
   * 灯塔类型弹窗关闭，若是没有相应的值，则默认设置为第一个
   */
  handleTypePopupPickerHide (closeType) {
    if (closeType && parseInt(this.form.type[0]) === 0) {
      this.form.type = [(this.types[0] && this.types[0][0].value) || 0]
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";
.ft-sz {
  font-size: 16px;
  display: none;
}
.p-create-lite {
  font-size: 15px;
  padding-bottom: 70px;

  .error-tips {
    padding: 13px 15px 11px;
    background: rgba(255, 52, 52, .06);
    font-size: 14px;
    font-weight: lighter;
  }

  .form {
    padding: 0 15px;

    &:first-child {
      padding-top: 15px;
    }

    .asterisk {
      margin-right: 3px;
    }

    .form-group {
      padding-top: 16px;

      &.flex {
        .setFlex();
        margin: 0 5px;
        padding-bottom: 4px;
        border-bottom: solid 1px #ededed; /* no */

        & > label {
          padding: 0 10px 0 0;
          flex: 0 0 auto;
        }

        .control-container {
          flex: 1 1 auto;

          .control {
            text-align: right;
          }
        }
      }

      & > label {
        padding: 0 5px;
        line-height: 32px;
        font-weight: 300;
        color: #666;

        .asterisk {
          color: @color-primary;
        }
      }

      .control-container {
        font-size: 0;
      }

      textarea.control {
        padding: 15px;
        background: #fbfbfb;
        height: auto;
        line-height: 19px;
        border: solid 1px #ededed; /* no */
        border-radius: 3px;
        resize: none;
      }

      .control {
        box-sizing: border-box;
        background: none;
        width: 100%;
        height: 32px;
        border: none;
        color: @font-color-default;
        font-size: 15px;
        -webkit-appearance: none;

        &:disabled {
          color: #929292;
        }

        &::placeholder {
          color: #bcbcbc;
        }
      }
    }

    .protocol {
      margin: 12px 5px 6px;
      line-height: 18px;
      font-size: 12px;
      color: #bcbcbc;

      & > a {
        color: @color-primary;
      }
    }

    .contact {
      padding: 10px 5px;

      .label {
        line-height: 25px;
        font-size: 15px;
        font-weight: 300;
        color: #666;

        .asterisk {
          color: #bcbcbc;
        }
      }

      .contents {
        .setFlex();

        & > p {
          flex: 1 1 auto;
          width: 50%;
          line-height: 18px;
          font-size: 12px;
          color: #bcbcbc;
        }
      }
    }
  }

  .g-footer {
    padding: 12px 20px;
    background: #fff;
    border-top: solid 1px #ededed; /* no */

    .submit {
      padding: 11px 25px 9px;
      width: 100%;
      background-color: #ffe266;
      line-height: 24px;
      border-radius: 22px;
      font-size: 15px;
      color: @font-color-default;

      &:disabled {
        background-color: #f8f8f8;
        color: #666;
      }
    }
  }
}
</style>
