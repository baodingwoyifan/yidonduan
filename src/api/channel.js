// 频道 相关的请求函数
import request from '@/utils/request.js' // 引入封装的模块

// 获得用户频道列表数据，无论用户是否登录系统，都可以获取
//没有登录的话，服务器端会根据手机的唯一标识获取列表信息
export function apiChannelList() {
    return request({
        url: '/app/v1_0/user/channels',
        method: 'get'
        // method:'get'  //可以不设置，默认是get请求
    })
}
