import http from '@/util/http'
import { Video, User, VideoStats, UserState, UserStats } from '@/api/Models'

/**
 * @description 获取视频信息
 */
export function getVideo(vid: number) {
    return http.get<Video>('/main/video/public/getVideoById', { vid: vid })
};
/**
 * @description 获取视频数据
 */
export function getVideoStats(vid: number) {
    return http.get<VideoStats>('/main/video/public/getVideoStatsById', { vid: vid })
};
/**
 * @description 获取作者信息
 */
export function getUserInfo(uid: number) {
    return http.get<User>('/main/user/public/getById', { id: uid })
};
export function getAuthorStat(uid: number) {
    return http.get<UserStats>('/main/user/public/getUserStatById', { id: uid })
};

export const defaultVideo: Video = {
    vid: 0,
    uid: 0,
    title: "视频标题视频标题视频标题视频标题视频标题视频标题视频标题视频标题视频标题视频标题视频标题视频标题视频标题",
    type: 0,
    auth: 0,
    duration: 600,
    mcId: 0,
    scId: 0,
    status: 1,
    visible: 0,
    tags: "测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 测试标签 ",
    descr: "视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介视频简介",
    coverUrl: "",
    videoUrl: "",
    uploadDate: "2100-12-31"
}
export const defaultVideoStats: VideoStats = {
    vid: 0,
    play: 0,
    danmu: 0,
    good: 0,
    bad: 0,
    coin: 0,
    collect: 0,
    share: 0,
    comment: 0
}
export const defaultUserInfo: User = {
    uid: 0,
    username: "000000000",
    nickname: "昵称",
    avatar: "https://morton321.oss-cn-hangzhou.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-02-11%20232613.png",
    gender: 2,
    description: "UP主简介UP主简介UP主简介UP主简介UP主简介UP主简介UP主简介UP主简介UP主简介",
    status: 0,
    role: 0,
    createDate: new Date(),
    deleteDate: new Date()
}