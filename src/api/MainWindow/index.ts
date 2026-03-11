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
    { id: 1, href: "https://www.bilibili.com/blackboard/era/hcjvGIlWLJbFJjXY.html?msource=search&spm_id_from=333.337.0.0", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_1.png", style: "#5a769a", title: "@哔哩哔哩公益 官方邀请你，投稿守护小流浪>>" },
    { id: 2, href: "https://www.bilibili.com/bangumi/play/ep1447160", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_2.png", style: "#808ca5", title: "追踪英国的冰冷杀手" },
    { id: 3, href: "https://www.bilibili.com/bangumi/play/ss48519?spm_id_from=333.337.0.0", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_3.png", style: "#34292a", title: "有我在，谁敢动秦阳一根手指头" },
    { id: 4, href: 'https://www.bilibili.com/blackboard/era/U5v708csF3Jqsa6p.html', src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_4.png", style: "#241b11", title: "文明7！启动！！" },
    { id: 5, href: "https://www.bilibili.com/blackboard/era/u8QNvoAm2GBE9VIG.html?spm_id_from=333.337.0.0", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_5.png", style: "#d79b75", title: "新年新气象，投稿美食视频参与瓜分2.5W贝壳金" },
    { id: 6, href: "https://www.bilibili.com/video/BV1ykNVeJEPt/?spm_id_from=333.337.search-card.all.click&vd_source=7e1929799f2f0e3945358988a0f7b127", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_6.png", style: "#4c4f6e", title: "到底谁才是反派啊？！" },
    { id: 7, href: "https://www.bilibili.com/opus/1024864864266354688", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_7.png", style: "#8d7876", title: "是的！我们玩世界之外！" },
    { id: 8, href: "", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_8.png", style: "#574e25", title: "用“我的世界”打开元宵节？" },
    { id: 9, href: "https://www.bilibili.com/bangumi/play/ep1438453", src: "https://morton321.oss-cn-hangzhou.aliyuncs.com/slide_9.png", style: "#5a769a", title: "那兔第七季开播！种花之梦成于实干！" },
]
export const parVideoList: VideoVo[] = [
]
/**
 * @description 获取首页推荐视频列表
 */
export function getRecVideoList(query: VideoQueryVo) {
    return http.get<PageRes<VideoVo>>('/main/video/home/pageVideo', query)
};