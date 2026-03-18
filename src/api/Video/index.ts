import http from '@/util/http'
import { Query, PageRes, UserVideo, Danmu, VideoVo, VideoQueryVo, Follow, BrowseHistory, User } from '../Models'
import { Interaction } from '../enums'

export interface VideoTag {
    id: number
    href: string
    name: string
}
export enum CommentFilter {
    UP_TO_DATE = 1,
    HOTTEST = 2
}
export interface Comment {
    id: number
    vid: number
    uid: number
    rootId: number//根评论ID
    parentId: number//被回复的评论ID
    toUserId: number//被回复的用户ID
    content: string
    love: number
    bad: number
    createTime: string
    isTop: number
    isDeleted: number
}
export interface CommentQuery extends Query {
    id?: number
    sortField?: string
    vid: number
    uid?: number
    rootId?: number
    toUserId?: number
    parentId?: number
}

export interface CommentVo extends Comment {
    nickname: string
    avatar: string
    replyCount: number
}
export interface UserVideoQuery {
    id?: number
    uid: number
    vid: number
    actionType?: Interaction
    actionTime?: string
}
export interface RecoQueryVo {
    uid?: number
    count?: number
    vid?: number
    tag?: number
}
export interface LikeDTO {
    bizId: number
    bizType: number
    liked: boolean
}
export interface BatchCollectVo {
    vid: number
    fids: number[]
    uid: number
}
export const defaultVideoVo: VideoVo = {
    uid: 0,
    nickname: "string",
    title: "string",
    duration: 1456,
    coverUrl: "",
    uploadDate: "5-21",
    vid: 0,
    play: 0,
    danmu: 0,
    good: 0,
    coin: 0,
    collect: 0,
}
/**
 * @description 获取根评论
 */
export function getRootComments(query: CommentQuery) {
    return http.get<PageRes<CommentVo>>('/main/comment/pageCommentVo', query)
};
/**
 * @description 获取回复
 */
export function getReply(query: CommentQuery) {
    return http.get<PageRes<CommentVo>>('/main/comment/pageReply', query)
};
/**
 * @description 新增评论
 */
export function insertComment(e: Comment) {
    return http.post<number>('/main/comment/insert', e)
};
/**
 * @description 逻辑删除评论
 */
export function logicDelete(e: CommentQuery) {
    return http.put('/main/comment/logicDelete', e)
};
/**
 * @description 增加播放
 */
export function addPlay(query: UserVideoQuery) {
    return http.post('/main/video/public/play', query)
};
/**
 * @description 获取弹幕列表
 * @param vid
 */
export function getDanmuList(vid: number | string) {
    return http.get<Danmu[]>(
        `/main/danmu/public/getDanmuList?vid=${vid}`,
    )
}
/**
 * @description 发送弹幕
 */
export function postDanmu(query: Danmu) {
    return http.post('/main/danmu/post', query)
}
/**
 * @description 获取默认推荐列表
 * @param VideoQueryVo
 */
export function getDefaultVideoList(query: VideoQueryVo) {
    return http.get<PageRes<VideoVo>>('/main/video/home/pageVideo', query)
}
/**
 * @description 获取推荐列表
 * @param RecoQueryVo
 */
export function getRecVideoList(query: RecoQueryVo) {
    return http.get<VideoVo[]>('/main/video/getRealTimeRecommend', query)
}
/**
 * @description 筛选标签相近的用户
 * @param RecoQueryVo
 */
export function getSimilarUsers(query: RecoQueryVo) {
    return http.get<User[]>('/main/danmu/getSimilarUsers', query)
}
/**
 * @description 根据指定标签筛选弹幕
 * @param RecoQueryVo
 */
export function getDanmuByTag(query: RecoQueryVo) {
    return http.post<Danmu[]>('/main/danmu/filterUserByTags', query)
}
/**
 * @description 获取两个用户共同标签
 * @param RecoQueryVo
 */
export function getCommonTags(query: RecoQueryVo) {
    return http.get<string[]>('/main/danmu/getCommonTags', query)
}
/**
 * @description 获取点赞状态信息
 */
export function getLikeState(bizId: number) {
    return http.get<number>(`/remark/get/like?bizId=${bizId}`)
};
/**
 * @description 点赞
 */
export function like(dto: LikeDTO) {
    http.post('/remark/like', dto)
};
/**
 * @description 投币
 */
export function coin(query: UserVideoQuery) {
    return http.post<UserVideo>('/main/video/interact/coin', query)
};
/**
 * @description 获取投币状态信息
 */
export function getCoinState(query: UserVideoQuery) {
    return http.get<UserVideo>('/main/video/getInterActionCoin', query)
};
/**
 * @description 获取收藏状态信息
 */
export function getCollectState(query: UserVideoQuery) {
    return http.get<UserVideo>('/main/favorite/getInterActionFavorite', query)
};
/**
 * @description 查询关注状态
 */
export function getFollow(query: Follow){
    return http.get<Follow>('/main/fans/get/follow', query)
}
/**
 * @description 关注
 */
export function follow(query: Follow){
    return http.post<Follow>('/main/fans/follow', query)
}
/**
 * @description 取消关注
 */
export function unFollow(query: Follow){
    return http.delete<Follow>('/main/fans/unfollow', query)
}
/**
 * @description 新增历史记录
 */
export function insertHistory(query: BrowseHistory){
    return http.post('/main/history/add', query)
}