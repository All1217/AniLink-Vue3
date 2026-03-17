<template>
  <div class="video-container-v1 flex-row jcc" ref="vcv">
    <div class="left-container scroll-sticky">
      <div class="video-info-container win">
        <div class="video-info-title">
          <div class="video-info-title-inner flex-row-ac">
            <h1 class="video-title nto">{{ video.title }}</h1>
          </div>
          <div class="show-more">
            <div class="show-more-btn flex-row" @mouseenter="showTitlePanel = true"
              @mouseleave="showTitlePanel = false"><i class="iconfont icon-arrow"></i></div>
          </div>
          <div class="overflow-panel" v-show="showTitlePanel">
            <div class="title">{{ video.title }}</div>
            <div class="video-info-detail-list info pop-mode flex-row-ac">
              <div class="view item flex-row-ac">
                <i class="iconfont icon-bofangshu v-icon"></i>
                <div class="nto">{{ formatCount(videoStats.play) }}</div>
              </div>
              <div class="dm item">
                <i class="iconfont icon-danmushu v-icon"></i>
                <div class="nto">{{ formatCount(videoStats.danmu) }}</div>
              </div>
              <div class="pubdate-ip item flex-row-ac">
                <div class="nto">{{ video.uploadDate }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="video-info-meta flex-row-ac">
          <div class="video-info-detail-list video-info-detail-content flex-row-ac">
            <div class="view item flex-row-ac">
              <i class="iconfont icon-bofangshu v-icon"></i>
              <div class="nto">{{ formatCount(videoStats.play) }}</div>
            </div>
            <div class="dm item">
              <i class="iconfont icon-danmushu v-icon"></i>
              <div class="nto">{{ formatCount(videoStats.danmu) }}</div>
            </div>
            <div class="pubdate-ip item flex-row-ac">
              <div class="not">{{ video.uploadDate }}</div>
            </div>
            <!-- <div class="copyright item"></div> -->
          </div>
        </div>
      </div>
      <Player @get-instance="getInstance" @add-play-count="onAddPlayCount"
        :uid="userStore.token ? userStore.userInfo.uid : -1" :danmu-list="danmuList" :video-info="video"
        :author-name="user.nickname"></Player>
      <div class="video-toolbar-container flex-row-ac jc-spb">
        <div class="video-toolbar-left flex-row-ac">
          <div class="video-toolbar-left-main flex-row-ac">
            <div class="toolbar-left-item-wrap">
              <div title="点赞" class="video-like video-toolbar-left-item flex-row-ac"
                @click="interact(Interaction.LIKE)">
                <i class="iconfont icon-dianzan_kuai" :style="userVideo.love >= 1 ? 'color:#00aeec;' : ''"></i>
                <span class="nto" :style="userVideo.love == 1 ? 'color:#00aeec;' : ''">{{ formatCount(videoStats.good)
                }}</span>
              </div>
            </div>
            <div class="toolbar-left-item-wrap">
              <div title="投币" class="video-like video-toolbar-left-item flex-row-ac" @click="onCoinClick">
                <i class="iconfont icon-toubix" :style="userVideo.coin >= 1 ? 'color:#00aeec;' : ''"></i>
                <span class="nto" :style="userVideo.coin >= 1 ? 'color:#00aeec;' : ''">{{ formatCount(videoStats.coin)
                }}</span>
              </div>
            </div>
            <div class="toolbar-left-item-wrap">
              <div title="收藏" class="video-like video-toolbar-left-item flex-row-ac"
                @click="showFavorite = userStore.token ? true : false">
                <i class="iconfont icon-shoucangtianchong" :style="userVideo.collect == 1 ? 'color:#00aeec;' : ''"></i>
                <span class="nto" :style="userVideo.collect == 1 ? 'color:#00aeec;' : ''">{{
                  formatCount(videoStats.collect)
                }}</span>
              </div>
            </div>
            <div class="toolbar-left-item-wrap">
              <div title="分享" class="video-like video-toolbar-left-item flex-row-ac">
                <i class="iconfont icon-fenxiang1" :style="userVideo.share == 1 ? 'color:#00aeec;' : ''"></i>
                <span class="nto" :style="userVideo.share == 1 ? 'color:#00aeec;' : ''">{{ formatCount(videoStats.share)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="video-toolbar-right flex-row-ac">
          <div class="video-tool-more">
            <el-dropdown trigger="click">
              <span class="dropdown-tag flex-row-ac">
                <i class="iconfont icon-gengduo1 more-operate"></i>
              </span>
              <template #dropdown>
                <div class="be-dropdown-menu">
                  <div class="be-dropdown-item">稿件举报</div>
                </div>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="video-desc-container">
        <div class="basic-desc-info" :style="showMoreIntro ? 'height:auto;' : 'height:84px;'">
          <span class="desc-info-text">{{ video.descr }}</span>
        </div>
        <div class="toggle-btn" @click="showMoreIntro = !showMoreIntro">
          <div class="toggle-btn-text">{{ showMoreIntro ? '展开更多' : '收起' }}</div>
        </div>
      </div>
      <div class="video-tag-container">
        <div class="video-tag-panel flex-row-ac" :style="showMoreTags ? 'height:auto;' : 'height:36px;'">
          <div class="video-tag-r">
            <div class="show-more-tags" @click="showMoreTags = !showMoreTags"
              :style="showMoreTags ? 'transform:rotate(180deg);' : ''">
              <i class="iconfont icon-arrow"></i>
            </div>
          </div>
          <div class="video-tag" v-for="e in video.tags.split(' ')">
            <div class="firstchannel-tag">
              <a class="tag-link">{{ e }}</a>
            </div>
          </div>
        </div>
      </div>
      <Comments ref="comments" v-if="userStore.token" :video-id="video.vid" :author-id="video.uid"></Comments>
      <div class="comment-unlogin" v-else>登录后查看评论</div>
    </div>
    <div class="right-container">
      <div class="right-container-inner">
        <div class="up-info-container flex-row-ac">
          <div class="up-info--left">
            <div class="up-avatar-wrap flex-row-ac jcc">
              <router-link :to="{ name: 'UserPage', params: { uid: user.uid } }" class="up-avatar">
                <img :src="user.avatar" alt="">
              </router-link>
            </div>
          </div>
          <div class="up-info--right">
            <div class="up-info__detail">
              <div class="up-detail-top flex-row-ac">
                <router-link :to="{ name: 'UserPage', params: { uid: user.uid } }" class="up-name nto">
                  {{ user.nickname }}
                </router-link>
                <router-link :to="{ name: 'MC_whisper', query: { targetId: user.uid } }" class="send-msg flex-row-ac">
                  <i class="iconfont icon-sixin"></i>发消息
                </router-link>
              </div>
              <div class="up-description nto" title="up主简介">{{ user.description }}</div>
            </div>
            <div class="up-info__btn-panel flex-row">
              <!-- <div>充电</div> -->
              <div class="follow-btn follow flex-row-ac jcc" v-show="upInfo.isFollow == 0" @click="onFollow">
                <i class="iconfont icon-tianjia"></i>关注&nbsp;{{ formatCount(upInfo.fansCount) }}
              </div>
              <div class="follow-btn unfollow flex-row-ac jcc" v-show="upInfo.isFollow == 2">
                <i class="iconfont icon-caidan"></i>{{ formatCount(upInfo.fansCount) }}
              </div>
              <el-dropdown trigger="click">
                <div class="follow-btn unfollow flex-row-ac jcc" v-show="upInfo.isFollow == 1">
                  <i class="iconfont icon-caidan"></i>已关注&nbsp;{{ formatCount(upInfo.fansCount) }}
                </div>
                <template #dropdown>
                  <div class="be-dropdown-menu">
                    <div class="be-dropdown-item">设置分组</div>
                    <div class="be-dropdown-item" @click="onUnfollow">取消关注</div>
                  </div>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <!-- 弹幕列表 -->
        <DanmuBox :danmu-list="danmuList" :video-info="video"></DanmuBox>
        <Collection></Collection>
      </div>
    </div>
    <div class="fixed-sidenav-storage" v-show="showTop">
      <div class="back-to-top-wrap" @click="backToTop">
        <div class="back-to-top flex-col-ac">
          <svg class="c-icon" aria-hidden="true">
            <use xlink:href="#icon-shouqixiao"></use>
          </svg>
          顶部
        </div>
      </div>
    </div>

    <el-dialog v-model="showCoin" width="430">
      <template #header="{ titleId }">
        <div class="my-header">
          <div :id="titleId" class="dialog-title">给UP主投上<span>{{ coinCount }}</span>枚硬币</div>
        </div>
      </template>
      <div class="flex-row jc-spb">
        <div :class="coinCount == 1 ? 'mc-box left mc-box-ac' : 'mc-box left mc-box-unac'" @click="coinCount = 1">
          <div class="coin-run-box"
            :style="coinCount == 1 ? 'background-color: #fff;' : 'background-color: transparent;'">
            <img src="../../assets/images/22-coin-ani.png" alt=""
              :style="coinCount == 1 ? 'opacity: 1;' : 'opacity: 0;'">
          </div>
          <span class="c-num" :style="coinCount == 1 ? 'color:#00aeec;' : 'color:#9499a0;'">1硬币</span>
        </div>
        <div :class="coinCount == 2 ? 'mc-box right mc-box-ac' : 'mc-box right mc-box-unac'" @click="coinCount = 2">
          <div class="coin-run-box"
            :style="coinCount == 2 ? 'background-color: #fff;' : 'background-color: transparent;'">
            <img src="../../assets/images/33-coin-ani.png" alt=""
              :style="coinCount == 2 ? 'opacity: 1;' : 'opacity: 0;'">
          </div>
          <span class="c-num" :style="coinCount == 2 ? 'color:#00aeec;' : 'color:#9499a0;'">2硬币</span>
        </div>
      </div>
      <div class="dialog-bottom">
        <span class="bottom-btn"
          @click="interact(coinCount == 1 ? Interaction.COIN_ONE : Interaction.COIN_TWO)">确定</span>
      </div>
    </el-dialog>

    <el-dialog v-model="showFavorite" width="420" title="添加到收藏夹" center>
      <div class="favorite-box">
        <div class="favorite-content">
          <ul class="favorite-list">
            <div class="favorite-list-mask" v-show="showFavoriteListMask"></div>
            <li v-for="i in favoriteList" class="favorite-list-item flex-row-ac jc-spb" v-show="i.isDelete != 1">
              <div class="flex-row-ac">
                <el-checkbox label="" size="large" :checked="collectSet.has(i.fid)" @change="onSelectFavorite(i.fid)" />
                <span class="favorite-name">{{ i.title }}</span>
                <i class="favorite-personal" v-show="i.visible == 0">&nbsp;[私密]</i>
              </div>
              <span class="favorite-count">{{ i.count + '/1000' }}</span>
            </li>
          </ul>
          <div class="new-favorite">
            <div class="focus-to-new flex-row-ac" v-show="!showFavoriteListMask" ref="focusToNew">
              <el-icon>
                <Plus />
              </el-icon>
              <span class="new-title">新建收藏夹</span>
            </div>
            <div class="new-favorite-box flex-row" v-show="showFavoriteListMask" ref="newFavoriteArea">
              <input ref="newFavoriteInput" type="text" class="new-favorite-input" v-model.trim="FavoriteInput"
                placeholder="最多输入20个字">
              <el-tooltip content="请输入收藏夹名称" placement="top" trigger="contextmenu" v-model:visible="showNoNullText"
                virtual-triggering :virtual-ref="newFavoriteBtn"></el-tooltip>
              <button class="new-favorite-btn" @click="onNewFavorite" ref="newFavoriteBtn">新建</button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-bottom" style="padding: 0;">
          <span class="bottom-btn" @click="onCollectClick">确定</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

import Comments from "@/components/Video/Comments.vue";
import Collection from '@/components/Video/Collection.vue';
import DanmuBox from '@/components/Video/DanmuBox.vue';
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import Player from './Player.vue';

import { getFavoriteList, getFVByUidAndVid, collect } from '@/api/favorite'
import { formatCount, getFormatCurTime, geneId } from '@/util/index'
import { useUserStore } from '@/util/userStore'
import { Video, User, VideoStats, UserVideo, Danmu, Follow, Favorite } from "@/api/Models";
import { getVideo, getUserInfo, getVideoStats, defaultUserInfo, defaultVideo, defaultVideoStats, getAuthorStat } from '@/api/index'
import {
  getLikeState, UserVideoQuery, getDanmuList,
  like, getCoinState, getCollectState, coin, getFollow, follow, unFollow,
  LikeDTO,
} from '@/api/Video';
import Artplayer from 'artplayer';
import { DateStringType, Interaction } from '@/api/enums';
import { addFavorite } from '@/api/UserPage/index'

const userStore = useUserStore()
const route = useRoute()
const video = ref<Video>(defaultVideo)
const videoStats = ref<VideoStats>(defaultVideoStats)//视频交互数据
const user = ref<User>(defaultUserInfo)
const showTitlePanel = ref(false);
const showCoin = ref<boolean>(false)
const coinCount = ref<number>(1)//用户选择的硬币数

const focusToNew = ref<HTMLDivElement | null>(null)
const showNoNullText = ref(false)

const comments = ref(null);
const emit = defineEmits(['callLoginPanel']);
const userVideo = ref<UserVideo>({
  id: 0,
  uid: 0,
  vid: 0,
  play: 0,
  love: 0,
  unlove: 0,
  coin: 0,
  collect: 0,
  share: 0,
  playTime: "2100-15-15 15:15:15",
  loveTime: "2100-15-15 15:15:15",
  coinTime: "2100-15-15 15:15:15"
})
//是否展开简介
const showMoreIntro = ref(false);
//是否展开标签
const showMoreTags = ref(false);
//up主粉丝数和关注状态
const upInfo = reactive({
  isFollow: 2,
  fansCount: 0
})
//是否显示返回顶部按钮
const showTop = ref(false)
const vcv = ref<HTMLElement | null>(null);
const danmuList = ref<Danmu[]>([])
/**
 * @description: 收藏管理
 */
const showFavorite = ref<boolean>(false)
const showFavoriteListMask = ref<boolean>(false)
const FavoriteInput = ref<string>('')
const newFavoriteArea = ref<HTMLDivElement | null>(null)
const newFavoriteBtn = ref<HTMLButtonElement | null>(null)
const newFavoriteInput = ref<HTMLInputElement | null>(null)
const favoriteList = ref<Favorite[]>([])
const collectSet = ref<Set<number>>(new Set<number>())
function onSelectFavorite(fid: number) {
  if (collectSet.value.has(fid)) {
    collectSet.value.delete(fid);
    favoriteList.value.forEach(e => {
      if (e.fid == fid) e.count--;
    })
  } else {
    collectSet.value.add(fid);
    favoriteList.value.forEach(e => {
      if (e.fid == fid) e.count++;
    })
  }
}
function onCollectClick() {
  showFavorite.value = false
  if (userVideo.value.collect >= 1 && collectSet.value.size == 0) {
    userVideo.value.collect = 0;
    videoStats.value.collect -= 1;
  }
  if (userVideo.value.collect == 0 && collectSet.value.size > 0) {
    userVideo.value.collect = 1;
    videoStats.value.collect += 1;
  }
  const temp = [];
  collectSet.value.forEach(id => {
    temp.push(id);
  })
  onCollect(temp)
}
async function onCollect(q: number[]) {
  try {
    await collect({ fids: q, uid: userStore.userInfo.uid, vid: geneId(route.params.vid) })
  } catch (error) {
    console.log(error)
    ElMessage.error('操作失败！')
  }
}
async function onGetCollectState(query: UserVideoQuery) {
  try {
    const { data } = await getCollectState(query)
    if (data) userVideo.value.collect = data.collect
  } catch (error) {
    console.log(error)
    ElMessage.error('获取收藏状态失败！')
  }
}
async function onGetFavoriteList(uid: number) {
  try {
    const { data } = await getFavoriteList({ uid: uid, current: 1, size: 100 })
    favoriteList.value = data.records;
  } catch (error) {
    console.log(error)
    ElMessage.error('无法拉取收藏夹列表！')
  }
}
async function onGetFVByUidAndVid(uid: number, vid: number) {
  try {
    const { data } = await getFVByUidAndVid(uid, vid);
    data.forEach(id => {
      collectSet.value.add(id);
    })
  } catch (error) {
    console.log(error);
    ElMessage.error('无法获取本视频与收藏夹关联信息！');
  }
}

function handleBodyScroll() {
  if (!showTop.value && window.scrollY > 800) {
    showTop.value = true
  }
  if (showTop.value && window.scrollY <= 800) {
    showTop.value = false
  }
}
function backToTop() {
  window.scrollTo(0, 0)
}
function getInstance(art: Artplayer) {
  console.log(art);
}
function onAddPlayCount() {
  videoStats.value.play++;
}
function interact(type: Interaction) {
  if (!userStore.token) {
    ElMessage.warning('请先登录！');
    return;
  }
  showCoin.value = false
  const time = new Date()
  let query: UserVideoQuery = {
    uid: userStore.userInfo.uid,
    vid: video.value.vid,
    actionType: type,
    actionTime: getFormatCurTime(time.getTime(), DateStringType.ALL)
  }
  if (type == Interaction.LIKE) {
    onLike(query);
  } else if (type == Interaction.COIN_ONE || type == Interaction.COIN_TWO) {
    query.actionType = type - 1
    onCoin(query);
  }
}
function onCoinClick() {
  if (userVideo.value.coin >= 1) {
    ElMessage({ type: 'warning', message: '您已投过币！' })
  } else if (!userStore.token) {
    ElMessage({ type: 'warning', message: '请先登录！' })
  } else {
    showCoin.value = true
  }
}
function outNewFavorite(event: MouseEvent) {
  if (newFavoriteArea.value && !newFavoriteArea.value.contains(event.target as Node) && showFavoriteListMask.value) {
    showFavoriteListMask.value = false
  } else if (focusToNew.value && focusToNew.value.contains(event.target as Node) && !showFavoriteListMask.value) {
    showFavoriteListMask.value = true;
    FavoriteInput.value = ''
    newFavoriteInput.value.focus()
  }
}
function onNewFavorite() {
  if (FavoriteInput.value.length >= 100) {
    ElMessage.warning('收藏夹数量已达上限！')
    return;
  }
  if (FavoriteInput.value.length == 0) {
    showNoNullText.value = true
    return;
  }
  beforeAddFavor()
}
async function beforeAddFavor() {
  try {
    let query = {
      fid: 0,
      uid: userStore.userInfo.uid,
      type: 2,
      visible: 1,
      cover: null,
      title: FavoriteInput.value,
      description: '',
      count: 0,
      isDelete: 0
    }
    const res = await addFavorite(query)
    if (res.code == 200) {
      const { data } = await getFavoriteList({ uid: userStore.userInfo.uid, current: 1, size: 100 })
      favoriteList.value = data.records;
      showFavoriteListMask.value = false;
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('操作失败！')
  }
}
async function onGetDanmuList(vid: number | string) {
  try {
    const res = await getDanmuList(vid)
    danmuList.value = res.data
  } catch (error) {
    console.log(error)
  }
}
async function onGetVideo(vid: number) {
  try {
    const { data } = await getVideo(vid)
    video.value = data
    onGetUserInfo(data.uid)
    onGetAuthorStat(data.uid);
    onGetDanmuList(data.vid)
    if (userStore.token) {
      const temp = {
        uid: userStore.userInfo.uid,
        vid: video.value.vid
      }
      onGetLikeState(temp)
      onGetCoinState(temp)
      onGetCollectState(temp)
    }
  } catch (error) {
    ElMessage.error('获取视频失败！')
  }
}
async function onGetVideoStats(vid: number) {
  try {
    const { data } = await getVideoStats(vid)
    videoStats.value = data
  } catch (error) {
    ElMessage.error('获取视频数据失败！')
  }
}
async function onGetUserInfo(uid: number) {
  try {
    const { data } = await getUserInfo(uid)
    user.value = data
    if (userStore.token && user.value.uid != userStore.userInfo.uid) {
      onGetFollow({ followeeId: user.value.uid, followerId: userStore.userInfo.uid })
    }
  } catch (error) {
    ElMessage.error('获取作者信息失败！')
  }
}
async function onGetAuthorStat(uid: number) {
  try {
    const { data } = await getAuthorStat(uid)
    upInfo.fansCount = data.fansCount;
  } catch (error) {
    console.log(error)
  }
}
async function onGetLikeState(query: UserVideoQuery) {
  try {
    const { data } = await getLikeState(query)
    if (data) {
      userVideo.value.love = data.love
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('获取点赞信息失败！')
  }
}
async function onLike(query: UserVideoQuery) {
  like({ bizId: query.vid, bizType: 0, liked: userVideo.value.love == 0 ? true : false });
  if (userVideo.value.love == 0) {
    userVideo.value.love = 1;
  } else {
    userVideo.value.love = 0;
  }
  videoStats.value.good++;
}
async function onCoin(query: UserVideoQuery) {
  try {
    const res = await coin(query)
    if (res.code == 200) {
      userVideo.value.coin = res.data.coin
      videoStats.value.coin += res.data.coin
      ElMessage({ type: 'success', message: '投币成功！' })
    }
  } catch (error) {
    ElMessage.error('获取投币信息失败！')
  }
}
async function onGetCoinState(query: UserVideoQuery) {
  try {
    const { data } = await getCoinState(query)
    if (data) {
      userVideo.value.coin = data.coin
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('获取投币信息失败！')
  }
}
async function onGetFollow(query: Follow) {
  try {
    const res = await getFollow(query)
    if (res.data == null) {
      upInfo.isFollow = 0;
    } else {
      upInfo.isFollow = 1;
    }
  } catch (error) {
    ElMessage.error('获取关注信息失败！')
  }
}
async function onFollow() {
  try {
    const res = await follow({ followerId: userStore.userInfo.uid, followeeId: user.value.uid })
    if (res.code == 200) {
      ElMessage({ type: 'success', message: '关注成功！' })
      upInfo.isFollow = 1
    }
  } catch (error) {
    ElMessage.error('关注失败！')
  }
}
async function onUnfollow() {
  try {
    const res = await unFollow({ followerId: userStore.userInfo.uid, followeeId: user.value.uid })
    if (res.code == 200) {
      ElMessage({ type: 'success', message: '操作成功！' })
      upInfo.isFollow = 0
    }
  } catch (error) {
    ElMessage.error('操作失败！')
  }
}
onMounted(() => {
  document.addEventListener('click', outNewFavorite)
  window.addEventListener("scroll", handleBodyScroll)
  onGetVideo(geneId(route.params.vid))
  onGetVideoStats(geneId(route.params.vid))
  if (userStore.token) {
    onGetFavoriteList(userStore.userInfo.uid)
    onGetFVByUidAndVid(userStore.userInfo.uid, geneId(route.params.vid))
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleBodyScroll);
  window.removeEventListener("click", outNewFavorite);
});
</script>
<style lang="less" scoped>
@import '@/styles/Video/video.less';
</style>