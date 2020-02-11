import { extend } from 'vee-validate'
// 导入全部的规则
import * as rules from 'vee-validate/dist/rules'
// 注册全部的规则
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})
