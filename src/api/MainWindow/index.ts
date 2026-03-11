import http from '@/util/http'
import { VideoVo, VideoQueryVo, PageRes } from '@/api/Models'
import { SlideImage } from './types'

export const deRVL: VideoVo[] = [
    {
        uid: 0,
        vid: 0,
        nickname: "up主名称",
        title: "视频标题视频标题视频标题视频标题",
        duration: 600,
        coverUrl: "https://morton321.oss-cn-hangzhou.aliyuncs.com/defualtVideoCover.png",
        uploadDate: "2-30 12:12",
        play: 35666,
        danmu: 3698,
        good: 25000,
        coin: 15000
    },
    {
        uid: 0,
        vid: 0,
        nickname: "up主名称",
        title: "视频标题视频标题视频标题视频标题",
        duration: 600,
        coverUrl: "https://morton321.oss-cn-hangzhou.aliyuncs.com/defualtVideoCover.png",
        uploadDate: "2-30 12:12",
        play: 35666,
        danmu: 3698,
        good: 25000,
        coin: 15000
    },
    {
        uid: 0,
        vid: 0,
        nickname: "up主名称",
        title: "视频标题视频标题视频标题视频标题",
        duration: 600,
        coverUrl: "https://morton321.oss-cn-hangzhou.aliyuncs.com/defualtVideoCover.png",
        uploadDate: "2-30 12:12",
        play: 35666,
        danmu: 3698,
        good: 25000,
        coin: 15000
    },
    {
        uid: 0,
        vid: 0,
        nickname: "up主名称",
        title: "视频标题视频标题视频标题视频标题",
        duration: 600,
        coverUrl: "https://morton321.oss-cn-hangzhou.aliyuncs.com/defualtVideoCover.png",
        uploadDate: "2-30 12:12",
        play: 35666,
        danmu: 3698,
        good: 25000,
        coin: 15000
    },
    {
        uid: 0,
        vid: 0,
        nickname: "up主名称",
        title: "视频标题视频标题视频标题视频标题",
        duration: 600,
        coverUrl: "https://morton321.oss-cn-hangzhou.aliyuncs.com/defualtVideoCover.png",
        uploadDate: "2-30 12:12",
        play: 35666,
        danmu: 3698,
        good: 25000,
        coin: 15000
    },
    {
        uid: 0,
        vid: 0,
        nickname: "up主名称",
        title: "视频标题视频标题视频标题视频标题",
        duration: 600,
        coverUrl: "https://morton321.oss-cn-hangzhou.aliyuncs.com/defualtVideoCover.png",
        uploadDate: "2-30 12:12",
        play: 35666,
        danmu: 3698,
        good: 25000,
        coin: 15000
    },
]
//轮播图图片列表
export const slide_picture: SlideImage[] = [
    { id: 1, href: "https://live.bilibili.com/55?live_from=81001", src: "http://192.168.150.102:9000/avatar/0686ed2c-ed06-483a-878e-6d8af994caad.png", style: "#817681", title: "正在直播KPL：北京WB vs 重庆狼队！" },
    { id: 2, href: "https://www.lotuscars.com.cn/forme?utm_0=AbIZRr", src: "http://192.168.150.102:9000/avatar/59bc0302-4934-4805-989a-c3c29e755d8a.png", style: "#23241a", title: "全新莲花For Me预售现已开启" },
    { id: 3, href: "https://www.bilibili.com/bangumi/play/ep2401916", src: "http://192.168.150.102:9000/avatar/fa4dec61-f95e-4e63-b11a-ca8b7df72112.png", style: "#43536f", title: "魔门之女金小钗惊艳登场！" },
    { id: 4, href: 'https://www.bilibili.com/bangumi/play/ep3065297', src: "http://192.168.150.102:9000/avatar/83f12999-d6b8-4b6b-8c58-42c204aaef7d.png", style: "#2b2b2f", title: "此对道侣外星来，专收仙界智商税" },
    { id: 5, href: "https://www.bilibili.com/video/BV1mYPSzmEkV", src: "http://192.168.150.102:9000/avatar/c17d14be-6665-4d15-b416-2c4085586fef.png", style: "#c39686", title: "UP主给OpenClaw做了个龙虾管家" },
    { id: 6, href: "https://www.bilibili.com/video/BV1uSPxzSEXc/", src: "http://192.168.150.102:9000/avatar/f33b58b5-8c29-483b-8e9b-1d8f5fa63599.png", style: "#1b1616", title: "终于有一款新能源车…拒绝冰箱彩电大沙发了！" },
    { id: 7, href: "https://www.bilibili.com/bangumi/play/ep2895192", src: "http://192.168.150.102:9000/avatar/590a3333-1a3a-4162-8713-525ae69d90e7.png", style: "#592420", title: "清华理工男开的澡堂真的有点不一样..." },
    { id: 8, href: "https://www.bilibili.com/blackboard/era/bYlg7HZ1mAGEDb3I.html", src: "http://192.168.150.102:9000/avatar/f1e082df-7c6c-43f0-b1a2-811772cf6434.png", style: "#6e3311", title: "谁是下一个鬼畜新星？" },
    { id: 9, href: "https://www.bilibili.com/video/BV1CZPdzREGw", src: "http://192.168.150.102:9000/avatar/079cb9c7-6e3d-43d4-ad00-25bfde1c0cba.png", style: "#2d2219", title: "F1传奇|塞纳与普罗斯特：伯牙绝弦" },
]
export const parVideoList: VideoVo[] = [
]
/**
 * @description 获取首页推荐视频列表
 */
export function getRecVideoList(query: VideoQueryVo) {
    return http.get<PageRes<VideoVo>>('/main/video/home/pageVideo', query)
};