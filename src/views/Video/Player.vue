<template>
    <div class="player-wrap">
        <div class="bpx-player-primary-area flex-col">
            <div ref="playerArea" class="bpx-player-video-area">
                <div ref="VideoPlayer" class="core-player" id="core-player"></div>
            </div>
            <div class="bpx-player-sending-area">
                <div class="bpx-player-sending-bar flex-row-ac jc-spb">
                    <div class="bpx-player-video-info flex-row-ac">
                        <div class="bpx-player-video-info-online">
                            <b>{{ watchCount }}</b>人正在看
                        </div>
                        <div class="bpx-player-video-info-divide">，</div>
                        <div class="bpx-player-video-info-dm nto">{{ `已装填${danmuCount}条弹幕` }}</div>
                    </div>
                    <div ref="danmuEmitter" class="bpx-player-dm-root flex-row-ac">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import { ElMessage } from 'element-plus';

import { ref, onMounted, onBeforeUnmount, shallowRef, nextTick, watch, PropType } from "vue";

import { UserVideoQuery, addPlay, postDanmu, insertHistory } from '@/api/Video';
import { DateStringType, Interaction } from '@/api/enums';
import { getFormatCurTime } from '@/util/index'
import { useUserStore } from '@/util/userStore';
import { Danmu, Danmu as MyDanmu, BrowseHistory, Video } from '@/api/Models';

/**
 * @description: 显式声明事件
 */
const emit = defineEmits(['get-instance', 'addPlayCount']);
const props = defineProps({
    uid: {
        type: Number,
        default: -1
    },
    videoInfo: {
        type: Object as PropType<Video>,
        default: null
    },
    authorName: String,
    danmuList: {
        type: Object as PropType<MyDanmu[]>,
        default: []
    }
});
const danmuku = ref([])
const danmuCount = ref<number>(0)
const userStore = useUserStore()
const canAddPlay = ref<boolean>(true)
const watchCount = ref<number>(0)
const instance = shallowRef(null);
const VideoPlayer = ref<HTMLDivElement>(null);
const danmuEmitter = ref(null)
const option: Artplayer['Option'] = {
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    autoOrientation: true,
    url: '',
    container: '.core-player',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: danmuku.value,
            mount: '.bpx-player-dm-root',
            theme: 'light',
            beforeEmit(danmu) {
                if (!userStore.token) {
                    ElMessage({
                        message: '登录后可发送弹幕！',
                        type: 'warning'
                    })
                    return false;
                }
                if (danmu.text.length == 0) {
                    ElMessage({
                        message: '请输入弹幕内容！',
                        type: 'warning'
                    })
                    return false;
                }
                callPostDanmu(danmu)
                sendTestMessage(danmu.text)
                return true
            },
        }),
    ],
}
/**
 * @description: 增加历史记录
 */
function onAddHistory(time: number) {
    const date = new Date();
    const param: BrowseHistory = {
        id: 0, uid: props.uid, vid: props.videoInfo.vid,
        viewTime: getFormatCurTime(date.getTime(), DateStringType.ALL),
        duration: time,
        //TODO 判断是否完播的逻辑太简单了，应该计算累计播放时长
        isFinish: time >= props.videoInfo.duration - 2 ? 1 : 0,
        device: 'PC',
        ip: '北京',
        isDelete: 0
    }
    onInsertHistory(param);
}
async function onInsertHistory(param: BrowseHistory) {
    try {
        console.log(param)
        await insertHistory(param);
    } catch (error) {
        console.info(error);
    }
}
//websocket
const socket = ref<null | WebSocket>(null);
watch(() => props.videoInfo.vid, (newVal) => {
    if (newVal && newVal != 0) {
        connectWebsocket();
    }
}
)
const connectWebsocket = () => {
    if (socket.value) socket.value.close();
    const now = new Date();
    let tuid = 0;
    if(userStore.token){
        tuid = userStore.userInfo.uid;
    }
    // socket.value = new WebSocket(`ws://localhost:5051/ws/video?uid=${'' + tuid + now.getTime()}&vid=${props.videoInfo.vid}`);
    socket.value = new WebSocket(`ws://localhost:8090/ws/video/${props.videoInfo.vid}/${'' + tuid + now.getTime()}`);
    console.log( 'websocket状态：' +socket.value.readyState)
    socket.value.onmessage = parseMessage
};
const sendTestMessage = (text: string) => {
    if (socket.value == null || socket.value.readyState === WebSocket.CLOSED) {
        ElMessage.warning('正在连接websocket，请稍后……');
        connectWebsocket();
        return;
    }
    const msg = { uid: userStore.userInfo.uid, vid: props.videoInfo.vid, isDanmu: true, message: text, cnt: 0 }
    socket.value.send(JSON.stringify(msg));
};
const parseMessage = (event) => {
    const come = JSON.parse(event.data);
    console.log('收到消息：', come)
    if (!come.type) {
        watchCount.value = come.cnt;
    } else if (come.type) {
        console.log('发送弹幕：', come.message)
        instance.value.plugins.artplayerPluginDanmuku.emit({ text: come.message, time: instance.value.currentTime + 2 });
    }
}
function callPostDanmu(e) {
    const time = new Date()
    const query: Danmu = {
        uid: props.uid,
        vid: props.videoInfo.vid,
        content: e.text,
        fontsize: 14,
        mode: e.mode,
        color: e.color,
        timePoint: e.time,
        status: 1,
        createDate: getFormatCurTime(time.getTime(), DateStringType.ALL)
    }
    onPostDanmu(query)
}
/**
 * @description: 播放视频触发，步骤：
 *  1.通知父组件使视频播放数+1
 *  2.通知后端在缓存增加一条视频播放信息
 * @param: query: 用户UID与视频VID
 */
async function onAddPlay(query: UserVideoQuery) {
    onAddPlayCount();
    try {
        await addPlay(query)
    } catch (error) {
        console.log(error)
    }
}
async function onPostDanmu(query: MyDanmu) {
    try {
        const res = await postDanmu(query)
        if (res.code == 200) {
            ElMessage({
                message: '发送成功！',
                type: 'success'
            })
        }
    } catch (error) {
        console.log(error)
    }
}
/**
 * @description: 通知父组件使视频播放数+1
 */
function onAddPlayCount() {
    emit('addPlayCount');
}
watch(() => props.videoInfo.videoUrl, (newVal) => {
    if (newVal && instance && instance.value) {
        instance.value.switch = newVal
    }
}, { immediate: true, deep: true }
)
watch(() => props.danmuList, (newVal) => {
    if (newVal && instance && instance.value) {
        newVal.forEach(e => {
            danmuku.value.push({
                text: e.content,
                time: e.timePoint,
                color: e.color,
                mode: e.mode
            })
        })
        instance.value.plugins.artplayerPluginDanmuku.load();
        danmuCount.value = newVal.length
    }
}, { immediate: true, deep: true }
)
onMounted(() => {
    instance.value = new Artplayer(option);
    nextTick(() => {
        emit('get-instance', instance.value);
    });
    instance.value.on('play', () => {
        const time = new Date()
        const query: UserVideoQuery = {
            uid: props.uid,
            vid: props.videoInfo.vid,
            actionType: Interaction.PLAY,
            actionTime: getFormatCurTime(time.getTime(), DateStringType.ALL)
        }
        if (canAddPlay.value) {
            canAddPlay.value = false
            onAddPlay(query)
            onAddHistory(instance.value.currentTime);
        }
    })
    //TODO 销毁时发送请求无效
    // instance.value.on('destroy', () => {
    //     const date = new Date();
    //     const param: BrowseHistory = {
    //         id: 0, uid: props.uid, vid: props.vid,
    //         viewTime: getFormatCurTime(date.getTime(), DateStringType.ALL),
    //         duration: instance.value.currentTime,
    //         //TODO 判断是否完播的逻辑太简单了，应该计算累计播放时长
    //         isFinish: instance.value.currentTime >= props.duration - 2 ? 1 : 0,
    //         device: 'PC',
    //         ip: '北京',
    //         isDelete: 0
    //     }
    //     notifyStore.notifyB({ type: 'post', data: param, url: '/main/history/add' })
    // })
})
onBeforeUnmount(() => {
    if (instance.value) {
        instance.value.destroy(false);
    }
    if (socket.value) socket.value.close();
});
</script>
<style scoped lang="less">
.player-wrap {
    height: 476px;
    position: relative;

    .bpx-player-primary-area {
        flex-wrap: nowrap;
        height: 100%;
        width: 100%;

        .bpx-player-video-area {
            position: relative;
            background-color: var(--black);
            flex: 1;
            overflow: hidden;

            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }

            .core-player {
                height: 100%;
                width: 100%;
            }

            .canvas {
                position: absolute;
                width: 100%;
                height: 80%;
                top: 0;
                left: 0;
                z-index: 3;
            }
        }

        .bpx-player-sending-area {
            box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);

            .bpx-player-sending-bar {
                background: var(--white);
                height: 46px;
                position: relative;
                padding: 0 12px;

                .bpx-player-video-info {
                    margin-right: 24px;
                    width: auto;
                    flex-shrink: 1;
                    height: 16px;
                    overflow: hidden;
                    position: relative;
                    user-select: none;
                    white-space: nowrap;

                    .bpx-player-video-info-online,
                    .bpx-player-video-info-divide,
                    .bpx-player-video-info-dm {
                        font-size: 13px;
                        line-height: 18px;
                        color: var(--font-color-gray2);
                        position: relative;

                        b {
                            font-weight: 400;
                            margin-right: 3px;
                        }
                    }
                }

                .bpx-player-dm-root {
                    flex: auto;
                    height: 34px;
                }
            }
        }
    }
}
</style>