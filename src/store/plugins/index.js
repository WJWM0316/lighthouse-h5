import logger from './logger'

// 开发环境中间件
const dev = [
  logger
]

// 生产环境中间件
const prod = []

// 开发环境和生产环境也需要的中间件
const common = []

let info = []
if (process.env.NODE_ENV !== 'production') {
  info = [...common, ...prod, ...dev]
} else {
  info = [...common, ...prod]
}

export default info
