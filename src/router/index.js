import Vue from 'vue'
import Router from 'vue-router'

// 模块路由
import TestRoutes from './test'

const routes = [
  ...TestRoutes
]

Vue.use(Router)

export default new Router({
  routes: routes
})
