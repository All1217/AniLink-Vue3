import { Gender, Vip, AccountStatus, AccountRole, Auth } from "./enums"
import { SearchHistory } from "./app"

export interface Image {
    id?: number
    alt?: string
    width?: number
    height?: number
    src: string
}
export interface Collection {
    id: number
    //TODO
}
export interface Video {
    vid: number
    uid: number
    title: string
    type: number//是否自制
    auth: number//作者声明，是否允许转载
    duration: number
    mcId: number//主分区ID
    scId: number//子分区ID
    status: number//审核状态
    visible: number//可见状态
    tags: string//标签
    descr: string
    coverUrl: string
    videoUrl: string
    uploadDate?: string
    deleteDate?: string
}
export interface Query {
    current?: number
    size?: number
}
//仅包含部分信息用于视频微缩展示
export interface VideoVo extends VideoStats {
    uid: number,
    nickname: string//作者名
    title: string
    duration: number
    coverUrl: string
    uploadDate: string
}
export interface VideoStats {
    vid: number
    play: number
    danmu: number
    good: number
    bad?: number
    coin: number
    collect?: number
    share?: number
    comment?: number
}
export interface VideoQueryVo extends Query {
    title?: string | null
    sortType?: number | null
    startTime?: string | null
    endTime?: string | null
    startDuration?: number | null
    endDuration?: number | null
    mcId?: number | null
    sortField?: string | null
    uid?: number
}
export interface User {
    uid: number
    username: string//账号
    password?: string
    nickname: string//用户名
    avatar: string
    background?: string//主页背景图
    gender: Gender
    description: string//个性签名
    exp?: number//经验值
    coin?: number
    vip?: Vip
    status: AccountStatus
    role: AccountRole
    auth?: Auth
    authMsg?: string
    createDate: Date
    deleteDate: Date
}
export interface UserStats {
    uid: number
    fansCount: number
    followCount: number
    likeCount: number
    playCount: number
    videoCount: number
    collectionCount: number
    collectCount: number
    birthDate: Date
    school: string
    notice: string
}
export interface UserVo {
    uid: number
    nickname: string
    description: string
    gender: number
    birthDate: string
    school: string
}
export interface Partition {
    id: number
    icon?: string
    name: string
    href?: string
}
export interface UserState {
    userInfo: User
    token?: string
    sh?: SearchHistory[]
}
export interface FavState {
    favList?: Favorite[]
}
export interface UserVideo {
    id: number
    uid: number
    vid: number
    play: number
    love: number
    unlove: number
    coin: number
    collect: number
    playTime: string
    loveTime: string
    coinTime: string
    share?: number
}
export interface Danmu {
    id?: number
    uid: number
    vid: number
    content: string
    fontsize: number
    mode: number
    color: string
    timePoint: number
    status: number
    createDate: string
}
export interface Follow {
    id?: number
    followerId: number
    followeeId: number
    createdAt?: string
}
export interface Favorite {
    fid: number
    uid: number
    type: number
    visible: number
    cover: string
    title: string
    description: string
    count: number
    isDelete: number
}
export interface VideoFavoriteVo extends VideoVo {
    time: string//收藏时间
}
export interface FavoriteQueryVo extends Query {
    uid?: number
}
export interface BrowseHistory {
    id?: number
    uid: number
    vid: number
    viewTime: string
    duration: number
    isFinish: number
    device: string
    ip: string
    isDelete: number
}
export interface TubeMessage {
    type: string
    data: any
    url?: string
}
/* 登录接口参数类型 */
export interface LoginData {
    username: string
    password: string
    captchaKey: string
    captchaCode: string
}
export interface ValidateUCodeData {
    image: string
    key: string
}
// * 请求响应参数(不包含data)
export interface Result {
    code: number
    message: string
    success?: boolean
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
    data: T
}
// * 分页响应参数
export interface PageRes<T> {
    records: T[]
    // 当前页
    current?: number
    // 每页显示条数
    size?: number
    total: number
}