import { Gender, AccountStatus, AccountRole } from "./enums"
import { User, UserStats } from "./Models"
import http from '@/util/http'
import { Unread } from "./UserPage/types"
import { ChatQueryVo } from "./MessageCenter/types"

interface Popular {
    title: string
    href: string
    icon?: string
}

interface LoginData {
    username: string
    password: string
}

interface RegisterData {
    nickname: string
    password: string
}

export interface SearchHistory {
    id: number
    content: string
    cnt: number//最近搜索时间，是时间戳
}

export interface Partition {
    id: number
    icon: string
    name: string
    link: string
}

export interface HotSearch {
    keyword: string
    show_name: string
    icon: string
    uri: string
    goto: string
    heat_score: number
}

export const partitonList: Partition[] = [
    { id: 1, icon: "#icon-wodezhuifan", name: "番剧", link: "https://www.bilibili.com/anime/?spm_id_from=333.1007.0.0" },
    { id: 2, icon: "#icon-dianying", name: "电影", link: "https://www.bilibili.com/movie/?spm_id_from=333.1007.0.0" },
    { id: 3, icon: "#icon-guochandonghuatuijian", name: "国创", link: "https://www.bilibili.com/guochuang/?spm_id_from=333.1007.0.0" },
    { id: 4, icon: "#icon-dianshiju", name: "电视剧", link: "https://www.bilibili.com/tv/?spm_id_from=333.1007.0.0" },
    { id: 5, icon: "#icon-guanggao", name: "综艺", link: "https://www.bilibili.com/variety/?spm_id_from=333.1007.0.0" },
    { id: 6, icon: "#icon-chun", name: "纪录片", link: "https://www.bilibili.com/documentary/?spm_id_from=333.1007.0.0" },
    { id: 7, icon: "#icon-dong", name: "动画", link: "https://www.bilibili.com/c/douga/?spm_id_from=333.1007.0.0" },
    { id: 8, icon: "#icon-youxi", name: "游戏", link: "https://www.bilibili.com/c/game/?spm_id_from=333.1007.0.0" },
    { id: 9, icon: "#icon-guixu", name: "鬼畜", link: "https://www.bilibili.com/c/kichiku/?spm_id_from=333.1007.0.0" },
    { id: 10, icon: "#icon-wodezhuifan", name: "音乐", link: "https://www.bilibili.com/c/music/?spm_id_from=333.1007.0.0" },
    { id: 11, icon: "#icon-wodezhuifan", name: "舞蹈", link: "https://www.bilibili.com/c/dance/?spm_id_from=333.1007.0.0" },
    { id: 12, icon: "#icon-wodezhuifan", name: "影视", link: "https://www.bilibili.com/c/cinephile/?spm_id_from=333.1007.0.0" },
    { id: 13, icon: "#icon-yule", name: "娱乐", link: "https://www.bilibili.com/c/ent/?spm_id_from=333.1007.0.0" },
    { id: 14, icon: "#icon-wanjietuijian", name: "知识", link: "https://www.bilibili.com/c/knowledge/?spm_id_from=333.1007.0.0" },
    { id: 15, icon: "#icon-keji-", name: "科技数码", link: "https://www.bilibili.com/c/tech/?spm_id_from=333.1007.0.0" },
    { id: 16, icon: "#icon-dianshiju-", name: "资讯", link: "https://www.bilibili.com/c/information/?spm_id_from=333.1007.0.0" },
    { id: 17, icon: "#icon-wodezhuifan", name: "美食", link: "https://www.bilibili.com/c/food/?spm_id_from=333.1007.0.0" },
    { id: 18, icon: "#icon-shenghuo", name: "小剧场", link: "https://www.bilibili.com/c/shortplay/?spm_id_from=333.1007.0.0" },
    { id: 19, icon: "#icon-wodezhuifan", name: "汽车", link: "https://www.bilibili.com/c/car?spm_id_from=333.1007.0.0" },
    { id: 20, icon: "#icon-shishang", name: "时尚美妆", link: "https://www.bilibili.com/c/fashion/?spm_id_from=333.1007.0.0" },
    { id: 21, icon: "#icon-wodezhuifan", name: "体育运动", link: "https://www.bilibili.com/c/sports/?spm_id_from=333.1007.0.0" },
    { id: 22, icon: "#icon-fanjutuijian", name: "动物圈", link: "" },
    { id: 23, icon: "#icon-wodezhuifan", name: "VLOG", link: "" },
    { id: 24, icon: "#icon-zuixinlianzai", name: "搞笑", link: "" },
    { id: 25, icon: "#icon-wodezhuifan", name: "单机游戏", link: "" },
    { id: 26, icon: "#icon-wodezhuifan", name: "虚拟UP主", link: "" },
    { id: 27, icon: "#icon-wodezhuifan", name: "公益", link: "" },
    { id: 28, icon: "#icon-suoyin", name: "公开课", link: "" },
    { id: 29, icon: "#icon-wodezhuifan", name: "专栏", link: "" },
    { id: 30, icon: "#icon-zhibo", name: "直播", link: "" },
    { id: 31, icon: "#icon-wodezhuifan", name: "活动", link: "" },
    { id: 32, icon: "#icon-shijianbiao", name: "课堂", link: "" },
    { id: 33, icon: "#icon-wodezhuifan", name: "社区中心", link: "" },
    { id: 34, icon: "#icon-bianjituijian", name: "新歌热榜", link: "" },
]
export const avaPar: Partition[] = [
    { id: 1, icon: "#icon-dong", name: "动画", link: "" },
    { id: 2, icon: "#icon-youxi", name: "游戏", link: "" },
    { id: 3, icon: "#icon-guixu", name: "鬼畜", link: "" },
    { id: 4, icon: "#icon-wodezhuifan", name: "音乐", link: "" },
    { id: 5, icon: "#icon-wodezhuifan", name: "舞蹈", link: "" },
    { id: 6, icon: "#icon-wodezhuifan", name: "影视", link: "" },
    { id: 7, icon: "#icon-yule", name: "娱乐/综艺", link: "" },
    { id: 8, icon: "#icon-wanjietuijian", name: "知识", link: "" },
    { id: 9, icon: "#icon-keji-", name: "科技", link: "" },
    { id: 10, icon: "#icon-dianshiju-", name: "资讯", link: "" },
    { id: 11, icon: "#icon-wodezhuifan", name: "美食", link: "" },
    { id: 12, icon: "#icon-shenghuo", name: "生活", link: "" },
    { id: 13, icon: "#icon-wodezhuifan", name: "运动", link: "" },
    { id: 14, icon: "#icon-fanjutuijian", name: "自然纪实/动物圈", link: "" },
    { id: 15, icon: "#icon-wodezhuifan", name: "VLOG", link: "" },
    { id: 16, icon: "#icon-zuixinlianzai", name: "搞笑", link: "" },
    { id: 17, icon: "#icon-wodezhuifan", name: "旅游出行", link: "" },
    { id: 18, icon: "#icon-wodezhuifan", name: "虚拟UP主", link: "" },
    { id: 19, icon: "#icon-suoyin", name: "公开课", link: "" },
]

export var defaultUser: User = {
    uid: 0,
    username: "123123123",
    nickname: "用户名",
    avatar: "../assets/images/logo.png",
    gender: Gender.UNKNOWN,
    description: "",
    coin: 0,
    status: AccountStatus.NORMAL,
    role: AccountRole.NORMAL,
    createDate: new Date(),
    deleteDate: new Date(),
}

export const DefaultUnread: Unread = {
    uid: 0,
    reply: 0,
    at: 0,
    love: 0,
    system: 0,
    whisper: 0,
    dynamic: 0
}
export const DefaultUserStats: UserStats = {
    uid: 0,
    fansCount: 0,
    followCount: 0,
    likeCount: 0,
    playCount: 0,
    videoCount: 0,
    collectionCount: 0,
    collectCount: 0,
    birthDate: new Date(),
    school: '',
    notice: '',
}

/**
 * @description 登录
 */
export function onLogin(data: LoginData) {
    return http.post<string>('/main/login', data)
}
/**
 * @description 登出
 */
export function onLogout() {
    http.post('/main/logout')
}
/**
 * @description 获取登录用户信息
 */
export function getUserInfoByUid() {
    return http.get<User>('/main/info')
}
/**
 * @description token续约
 */
export function refreshToken() {
    return http.get<string>('/main/public/refresh')
}
/**
 * @description 注册
 */
export function onRegister(data: RegisterData) {
    return http.post<string>('/main/user/register', data)
}
/**
 * @description 获取未读信息
 */
export function getWhisperUnread(param: ChatQueryVo) {
    return http.get<number>('/main/chat/getWhisperUnread', param)
}
/**
 * @description 获取热搜列表
 */
export function getHotSearch() {
    return http.get<HotSearch[]>('/main/dataCenter/mainWindow/get/hotSearch')
}