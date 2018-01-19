
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'suspension-input',
  props: {
    placeholder: String,
    sendText: String,
    commentIndex: Number,
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      this.isShow = val
      if (val && this.suspensionInput) {
        this.$nextTick(() => {
          this.suspensionInput.focus()
        })
      }
    },
    commentIndex (index, oldIndex) {
      if (index !== oldIndex) {
        this.suspensionInputContent = ''
      }
    },
    content (val) {
      this.suspensionInputContent = val
    }
  }
})
export default class suspensionInput extends Vue {
  suspensionInputContent = ''
  suspensionInput = ''
  isShow = false
  isFocused = false

  mounted () {
    this.suspensionInput = this.$refs['suspension-input']
  }

  send () {
    const value = this.suspensionInputContent
    const commentIndex = this.commentIndex
    if (!value) {
      this.$vux.toast.text('内容不能为空', 'bottom')
      return
    }

    this.$emit('send', {
      value,
      commentIndex
    })

    // 清除数据
    this.suspensionInputContent = ''
  }

  hide () {
    this.$emit('input', false)
    this.isFocused = false
  }

  handleFocus () {
    this.$emit('focus')
    this.isFocused = true
  }
}
