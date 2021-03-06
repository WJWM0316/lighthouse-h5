
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'suspension-input',
  props: {
    placeholder: String,
    sendText: String,
    commentIndex: Number,
    isShow: {
      type: Boolean,
      default: false
    },
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
    isShow (val) {
    },
    value (val) {
      // this.isShow = val
      if (val && this.suspensionInput) {
        this.$nextTick(() => {
          this.$refs['suspension-input'].focus()
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
  
  isFocused = false

  mounted () {
    this.suspensionInput = this.$refs['suspension-input']
  }

  send () {
    const value = this.suspensionInputContent
    const commentIndex = this.commentIndex

    console.log(1111)
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
    this.isFocused = false
    this.$emit('input', false)
  }

  handleFocus () {
    this.$emit('focus')
    this.isFocused = true
  }
}
