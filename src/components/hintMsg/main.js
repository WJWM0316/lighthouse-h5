
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'

@Component({
  name: 'hint-msg',
  props: {
    isHintShow: {
      type: Boolean,
      default: false
    },

    //title buttonText content  (content 数组)
    msg: {
      type: Object
    },

    type: {
      type: Number,
      default: 1
    }
  }
})
export default class hintMsg extends Vue {
  created () {
  }
  
  cloHint (){
    this.$emit('cloHint')
  }

  todo (){
    this.$emit('onConfirm')
  }

  //成功
  hintSucFuc (){
    console.log(this.type)
    this.$emit('hintSucFuc')
  }
}
