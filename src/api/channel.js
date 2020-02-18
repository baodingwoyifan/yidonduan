// 频道 相关的请求函数
import request from '@/utils/request.js' // 引入封装的axios模块
import store from '@/store' // 导入vuex模块，判断当前用户是否登录系统
// 本地持久化存储频道设置的key(游客 和 登录用户 分别设置)
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key未登录
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key
// 获得用户频道列表数据，无论用户是否登录系统，都可以获取
//没有登录的话，服务器端会根据手机的唯一标识获取列表信息
// --------------------------------------------------------------------->
// 老版获取频道api方法
// export function apiChannelList() {
//     return request({
//         url: '/app/v1_0/user/channels',
//         method: 'get'
//         // method:'get'  //可以不设置，默认是get请求
//     })
// }
// --------------------------------------------------------------------->
// 升级版获取频道api方法
// 首先获取本地储存频道
// 有的话-----直接使用
// 没有-------走axios-------储存到本地
// 同时考虑用户是否登录
// 登录  和  未登录的用户分别存储自己的频道数据（本地存储）
export function apiChannelList() {
    // 通过Promise封装，通过resolve返回输出具体信息，
    // 因为所有api接口的返回结果都是Promise对象
    // new Promise 中的resolve正确提示信息，reject错误提示信息
    // async修饰promise对象返回了resolve的实参数据， 使异步操作变为同步操作，避免回调地狱问题
    return new Promise(async (resolve, reject) => {
        // 判断用户是否登录，并执行不同的key（key就是第5行和第6行的代码）
        // 未登录：走第5行的‘key’
        // 登录：走第6行的‘key’
        const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
        // 获取本地频道数据
        // key在上面以经声明好了
        const localChannels = localStorage.getItem(key)
        if (localChannels) {
            // 输出频道数据给外部
            // 本地存储有频道数据的话，直接展示
            // 这里是因为home.vue中的获取频道数据的方法中的 （this.channelList = result.channels）代码是通过channels获取数据;
            // channels因为上面代码是通过channels获取数据的，所以这里也要是channels
            resolve({ channels: JSON.parse(localChannels) })
        } else {
            // 频道没有被缓存，那么久自己走axios获取频道数据
            let result = await request({
                url: '/app/v1_0/user/channels'
                // method:'get'  //可以不设置，默认是get请求
            })
            // 本地存储axios获取的频道数据
            localStorage.setItem(key, JSON.stringify(result.channels))
            // 输出频道数据给外部
            resolve(result)
        }
    })
}
/**
 * 获取所有频道数据
 */
export function apiChannelAll() {
    return request({
        url: '/app/v1_0/channels'
    })
}
// 添加频道
// 直接往本地储存添加频道信息
// new Promise为了返回的是一个Promise对象
export function apiChannelAdd(channel) {
    return new Promise(function (resolve) {
        let key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key，判断是否登录
        let localChannels = localStorage.getItem(key) // 根据key获取缓存中的频道信息
        // 频道不会为空的，至少会保留频道推荐项目
        // if (localChannels) {
            // 缓存有数据
            let channels = JSON.parse(localChannels)//把频道信息字符串变为对象形式
            channels.push(channel) // 追加频道信息
            // 重新写入缓存
            localStorage.setItem(key, JSON.stringify(channels))//把我们获得到的频道数据重新保存到本地
            resolve() // 成功执行，没有返回信息，成功率100%
        // }
    })
}
/**
 * 删除频道
 * @param {被删除频道的id} id
 */
export function apiChannelDel(id) {
    return new Promise(function (resolve) {
        // 获取登录和未登录的状态
        let key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key
        let localChannels = localStorage.getItem(key) // 获取频道缓存信息
        // 判断频道数据是否存在
        if (localChannels) {
            // 拿到转换后的缓存数据
            let channels = JSON.parse(localChannels)
            // 使用filter，通过id把被删除的频道从全部频道中排出
            channels = channels.filter(item => item.id !== id) // 排除删除的id
            // 把删除后的频道数据保存到本地存储
            localStorage.setItem(key, JSON.stringify(channels))
            resolve() // 成功执行
        }
    })
}