<template>
  <div class="bili-im flex-row">
    <div class="left rpos">
      <div class="title">
        <span>近期消息</span>
      </div>
      <div class="list-container rpos" ref="scrollContainer">
        <div class="list  rpos" ref="dynamic">
          <div class="list-item flex-row-ac rpos" v-show="chatVoList.length == 0">
            <span style="margin: auto;">没有新消息~</span>
          </div>
          <div :class="curUser == e.id ? 'list-item flex-row rpos cur-bgc' : 'list-item flex-row rpos'"
            v-for="e in chatVoList">
            <div class="avatar rpos" @click="onChatClick(e)">
              <img :src="e.senderId == userStore.userInfo.uid ? e.targetAvatar : e.senderAvatar" alt=""
                class="chat-avatar-img">
            </div>
            <div class="name-box flex-col jcc forbid-select" @click="onChatClick(e)">
              <div class="name flex-row-ac">
                <div class="name-value nto">
                  {{ e.senderId == userStore.userInfo.uid ? e.targetName : e.senderName }}
                </div>
              </div>
              <div class="last-word nto">{{ e.chatMessage == null ? '[暂无最新消息]' : e.chatMessage.content }}</div>
            </div>
            <div class="close flex-row-ac jcc" @click="onDeleteChatClick(e.senderId, e.targetId)">
              <i class="iconfont icon-guanbixiao"></i>
            </div>
            <div class="red-dot-notify" v-show="e.unreadCount > 0">{{ e.unreadCount }}</div>
          </div>
          <div class="ps__rail-y" ref="targetScroll">
            <div class="ps__thumb-y" ref="scrollbar"
              :style="`transform: translateY(${scrollTop * ((sh2 + ch1) / sh2)}px);height:${ch1 / sh2 * ch1}px;`"
              @mousedown="onMouseDown"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="go-chat flex-col-ac jcc" v-show="curUser == -1">
        <img src="../../assets/images/gochat.png" alt="">
        <p>快找小伙伴聊天吧 ( ゜- ゜)つロ</p>
      </div>
      <div class="dialog flex-col-st" v-show="curUser != -1">
        <div class="right-title jcc flex-row-ac rpos">
          <span>{{ curChat == null ? '' : curChat.senderId == userStore.userInfo.uid ? curChat.targetName :
            curChat.senderName }}</span>
          <div class="action-menu">
            <el-dropdown trigger="click">
              <i class="iconfont icon-gengduo1 action-menu-i"></i>
              <template #dropdown>
                <div class="be-dropdown-menu">
                  <div @click="wait" class="be-dropdown-item">置顶聊天</div>
                  <div @click="wait" class="be-dropdown-item">开启免打扰</div>
                  <div @click="wait" class="be-dropdown-item">加入黑名单</div>
                  <div @click="wait" class="be-dropdown-item">举报该用户</div>
                  <div @click="wait" class="be-dropdown-item">不接收推送</div>
                </div>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="message-list rpos" ref="messageListContainer" @scroll="onMessageListScroll">
          <div class="message-list-content">
            <div class="msg-more">
              <span class="no-more">没有更多消息了~</span>
            </div>
            <template v-for="(e, index) in messageList">
              <div class="msg-time" v-show="index == 0 || timeGap(e.time, messageList[index - 1].time, 300)">
                <span class="time">{{ formatStringDate(e.time, DateStringType.ALL) }}</span>
              </div>
              <div :class="e.senderId == userStore.userInfo.uid ? 'msg-item rpos is-me' : 'msg-item rpos not-me'">
                <a class="msg-item-avatar">
                  <img :src="e.senderId == curChat.senderId ? curChat.senderAvatar : curChat.targetAvatar" alt=""
                    class="msg-avatar-img">
                </a>
                <div class="message">
                  <div :class="e.messageType == 1 ? 'message-content rpos is-img' : 'message-content rpos is-not-img'">
                    <template v-if="e.messageType == 0">
                      <!-- 需要表情时添加 -->
                      <!-- <a class="emotion-items">
                        <div class="img-emoji"></div>
                      </a> -->
                      {{ e.content }}
                    </template>
                    <img src="../../assets/images/无置顶视频.png" alt="" v-show="e.messageType == 1" width="auto"
                      height="auto">
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="send-box">
          <div class="row flex-row-ac">
            <div class="space-margin" @click="wait">
              <label class="image-upload-btn"></label>
            </div>
            <div class="space-margin" @click="wait">
              <button class="emotion-btn-box"></button>
            </div>
          </div>
          <div class="input-box">
            <textarea class="core-style" maxlength="500" v-model.trim="inputText.text"
              @keydown="(e: KeyboardEvent) => { if (e.key === 'Enter') sendMessage() }"></textarea>
            <div class="indicator"><span>{{ inputText.length }}/500</span></div>
          </div>
          <div class="sendBtn flex-row-ac jce">
            <button :class="inputText.length > 0 && inputText.length <= 500 ? 'btn btn-ac' : 'btn btn-no-ac'"
              @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/styles/MessageCenter/index.less";
import { ref, onMounted, onBeforeUnmount, reactive, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { ChatVo, ChatMessage, ChatQueryVo, Chat, WebsocketMessage } from '@/api/MessageCenter/types';
import { getChatVoList, deleteChat, getChatMessage, geneChat, insertChatMessage, updateOpenTime, updateUnread } from '@/api/MessageCenter/index'
import { useUserStore } from "@/util/userStore";
import { removeOneElement, formatStringDate, geneId, getFormatCurTime, timeGap } from '@/util/index';
import { DateStringType } from "@/api/enums";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore()
/**
 * @description: 左侧通信列表
 */
const curChat = ref<ChatVo>(null)
const curUser = ref(-1);//当前激活的通话，是Chat对象的id，不是用户uid
const curTargetUid = ref<number>(-1)
const total = ref<number>(52)
const curPage = ref<number>(1);
const chatVoList = ref<ChatVo[]>([])//左侧近期通信用户列表
function onDeleteChatClick(si: number, ti: number) {
  curUser.value = -1;
  const flag = (e: ChatVo): boolean => {
    return e.senderId == si && e.targetId == ti;
  }
  chatVoList.value = removeOneElement(chatVoList.value, flag);
  onDeleteChat({ senderId: si, targetId: ti });
}
function onChatClick(e: ChatVo) {
  if (e.id == curUser.value) return;//如果点击对象和当前停留对象相同则返回
  //批量修改未读消息为已读(放在重置参数前)
  if (curChat.value && curChat.value.unreadCount > 0) {//先前的聊天对象如果unread>0则更新
    onUpdateUnread({
      uid: userStore.userInfo.uid,
      senderId: curChat.value.senderId,
      targetId: curChat.value.targetId
    });
    chatVoList.value.some((te) => {
      if (te.id == curUser.value) te.unreadCount = 0;
    })
  }
  if (e.unreadCount > 0) {
    onUpdateUnread({
      uid: userStore.userInfo.uid,
      senderId: e.senderId,
      targetId: e.targetId
    });
    e.unreadCount = 0;
  }
  //重置参数
  curChat.value = e;
  curUser.value = e.id;
  if (e.senderId == userStore.userInfo.uid) curTargetUid.value = e.targetId;
  else curTargetUid.value = e.senderId;
  //重置当前消息列表和所在页数
  messagePage.value = 1;
  messageList.value = [];
  //获取新的消息列表
  onGetChatMessage({ current: messagePage.value, size: 10, senderId: userStore.userInfo.uid, targetId: curTargetUid.value }, true);
  messagePage.value++;
  //更新最近打开时间
  onUpdateOpenTime(e.id);
}
async function onGetChatVoList(params: ChatQueryVo, init: boolean) {
  try {
    const res = await getChatVoList(params);
    chatVoList.value = chatVoList.value.concat(res.data.records)
    console.log(res.data.records)
    total.value = res.data.total;
    if (res.code == 200 && init) {//初始化时检查是否route带query，如果是需要新建一个聊天对象
      try {
        const tarId = geneId(route.query.targetId.toString())
        onGeneChat({
          id: 0,
          senderId: userStore.userInfo.uid,
          targetId: tarId,
          latestTime: getFormatCurTime(new Date().getTime(), DateStringType.ALL)
        })
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('无法获取聊天对象列表！')
  }
}
async function onDeleteChat(params: ChatQueryVo) {
  try {
    await deleteChat(params);
  } catch (error) {
    console.log(error)
    ElMessage.error('删除操作失败！')
  }
}
async function onGeneChat(params: Chat) {
  try {
    //带参数进入本页面时，尝试创造新聊天对象
    const res = await geneChat(params);
    let flag = false;
    let t: ChatVo = null;
    chatVoList.value.some((e) => {
      if (e.id == res.data.id) {
        flag = true;
        t = e;
      }
    })
    if (flag) onChatClick(t);//如果目前的列表已有该对象，则点击过去
    else {//否则插入新对象
      chatVoList.value.unshift(res.data);
      onChatClick(res.data);
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('查找单个chatVo失败！')
  }
}
async function onUpdateOpenTime(params: number) {
  try {
    const curTime = new Date();
    await updateOpenTime({ id: params, time: getFormatCurTime(curTime.getTime(), DateStringType.ALL) });
  } catch (error) {
    console.log(error)
    ElMessage.error('更新最近点击时间失败！')
  }
}
async function onUpdateUnread(params: ChatQueryVo) {
  try {
    await updateUnread(params);
  } catch (error) {
    console.log(error)
    ElMessage.error('更新未读消息失败！')
  }
}
/**
 * @description: 右侧聊天区
 */
const messageTotal = ref<number>(52)
const messagePage = ref<number>(1);
const canUpdateMsg = ref<boolean>(true);
const canTriggerMsg = ref<boolean>(false);
const messageListContainer = ref<HTMLDivElement | null>(null)
const messageList = ref<ChatMessage[]>([])
const inputText = reactive({
  text: "",
  length: 0,
});
watch(inputText, (newValue: any) => {
  inputText.length = newValue.text.length;
});
function onMessageListScroll() {
  if (messageListContainer.value) {
    const st = messageListContainer.value.scrollTop;
    if (canUpdateMsg.value && canTriggerMsg.value && st < 5) {
      canTriggerMsg.value = false;
      onGetChatMessage({ current: messagePage.value, size: 10, senderId: userStore.userInfo.uid, targetId: curTargetUid.value }, false);
      messagePage.value++;
      if (messageList.value.length >= messageTotal.value) canUpdateMsg.value = false;
    }
  }
}
async function onGetChatMessage(params: ChatQueryVo, isInit: boolean) {
  try {
    let { data } = await getChatMessage(params);
    data.records.reverse();
    messageList.value = data.records.concat(messageList.value)
    messageTotal.value = data.total;
    canTriggerMsg.value = true;
    if (isInit) {
      nextTick(() => {
        messageListContainer.value.scrollTop = messageListContainer.value.scrollHeight;
      })
    } else {
      nextTick(() => {
        messageListContainer.value.scrollTop = messageListContainer.value.scrollHeight / 2;
      })
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('无法获取消息列表！')
  }
}
async function onInsertChatMessage(params: ChatMessage) {
  try {
    await insertChatMessage(params);
  } catch (error) {
    console.log(error)
    ElMessage.error('无法获取消息列表！')
  }
}
/**
 * @description: websocket
 */
const socket = ref<null | WebSocket>(null);
const connectWebsocket = () => {
  if (socket.value) socket.value.close();// 关闭之前的连接（如果存在）
  // socket.value = new WebSocket(`ws://localhost:5051/ws/chat?uid=${'' + userStore.userInfo.uid}`);
  socket.value = new WebSocket(`ws://localhost:8090/ws/${'' + userStore.userInfo.uid}`);
  // 处理 WebSocket 事件
  socket.value.onopen = () => {
    console.log('WebSocket 连接已打开');
  };
  socket.value.onmessage = (event) => {
    const come = JSON.parse(event.data);
    const me = userStore.userInfo.uid;
    const t = curTargetUid.value;
    const curTime = new Date();
    if ((come.from == me && come.to == t) || (come.from == t && come.to == me)) {
      messageList.value.push(
        {
          id: -1,
          targetId: me,
          senderId: t,
          content: come.message,
          senderDel: 0,
          targetDel: 0,
          withdraw: 0,
          messageType: 0,
          time: getFormatCurTime(curTime.getTime(), DateStringType.ALL),
          readStatus: 1
        }
      )
    }
    else {
      let flag = false;
      chatVoList.value.some((e) => {
        if ((e.senderId == come.from && come.to == e.targetId) || (e.targetId == come.from && come.to == e.senderId)) {
          e.unreadCount++;
          flag = true;
        }
      })
      if (!flag) {
        onGeneChat({
          id: 0,
          senderId: come.from,
          targetId: userStore.userInfo.uid,
          latestTime: getFormatCurTime(new Date().getTime(), DateStringType.ALL)
        })
      }
    }
    nextTick(() => {
      messageListContainer.value.scrollTop = messageListContainer.value.scrollHeight;
    })
  };
  socket.value.onclose = () => {
    console.log('WebSocket 连接已关闭');
  };
};
const sendMessage = () => {
  if (inputText.length == 0) return;
  if (socket.value == null || socket.value.readyState === WebSocket.CLOSED) {
    ElMessage.warning('正在连接websocket，请稍后……');
    connectWebsocket();
    return;
  }
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    const msg: WebsocketMessage = { from: userStore.userInfo.uid, to: curTargetUid.value, message: inputText.text, isSystem: false };
    socket.value.send(JSON.stringify(msg));
    let curTime = new Date();
    const q: ChatMessage = {
      id: 0,
      targetId: curTargetUid.value,
      senderId: userStore.userInfo.uid,
      content: inputText.text,
      senderDel: 0,
      targetDel: 0,
      withdraw: 0,
      messageType: 0,
      time: getFormatCurTime(curTime.getTime(), DateStringType.ALL),
      readStatus: 0
    }
    messageList.value.push(q);
    onInsertChatMessage(q);
    inputText.text = '';
    nextTick(() => {
      messageListContainer.value.scrollTop = messageListContainer.value.scrollHeight;
    })
  } else {
    console.error('WebSocket 未连接');
  }
};

/**
 * @description: 自定义滚动条
 */
const canUpdateChatDetail = ref<boolean>(true);//是否允许更新消息，优先级大于下面的canTrigger
const canTrigger = ref<boolean>(false);//是否允许触发滑动到底部方法，防止过于频繁触发
const scrollContainer = ref<HTMLElement | null>(null);//总容器
const targetScroll = ref<HTMLElement | null>(null);//滑条的轨道
const scrollbar = ref<HTMLElement | null>(null);//滑条本身
const dynamic = ref<HTMLElement | null>(null);//列表，是总容器的直接子元素
const scrollTop = ref(0);
const sh1 = ref(0);//scrollContainer的总高度，大致等于其内容的总高度，会动态变化
const ch1 = ref(0);//scrollContainer的可见视窗高度，在552px左右
const sh2 = ref(0);//targetScroll的总高度，会动态变化
const mouse = reactive({ sy: 0 });
const dragging = ref(false);
const updateScrollbar = () => {
  if (scrollContainer.value) {
    scrollTop.value = scrollContainer.value.scrollTop;
    if (
      //总开关允许更新才更新
      canUpdateChatDetail.value
      //在上一个前提下，防抖锁解开才更新
      && canTrigger.value
      //在前面的前提下，初始化的数据总高度大于容器总高度才有必要开启更新
      && dynamic.value.offsetHeight > scrollContainer.value.offsetHeight - 10
      //最后是滑到底部的检测
      && scrollTop.value + scrollContainer.value.clientHeight > scrollContainer.value.scrollHeight - 10) {
      ElMessage.info('滑到底部开始更新')
      canTrigger.value = false;
      onScrollToBottom()
    }
  }
};
const onMouseDown = (event: MouseEvent) => {
  if (!scrollbar.value) return;
  dragging.value = true;
  mouse.sy = event.clientY;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
const onMouseMove = (event: MouseEvent) => {
  if (!dragging.value || !scrollContainer.value) return;
  const deltaY = event.clientY - mouse.sy;
  let newScrollTop = scrollContainer.value.scrollTop + (deltaY * sh2.value) / ch1.value;
  newScrollTop = Math.max(0, Math.min(newScrollTop, sh1.value - ch1.value));
  scrollContainer.value.scrollTop = newScrollTop;
  mouse.sy = event.clientY;
};
const onMouseUp = () => {
  dragging.value = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};
const onScrollToBottom = () => {
  onGetChatVoList({ uid: userStore.userInfo.uid, current: curPage.value, size: 10 }, false);
  curPage.value++;
  canTrigger.value = true;
  if (chatVoList.value.length >= total.value) canUpdateChatDetail.value = false;
}
function wait() {
  ElMessage.warning('尚待建设！')
}

onMounted(() => {
  document.body.ondragstart = () => false;
  connectWebsocket();
  if (scrollContainer.value && targetScroll.value) {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        if (target === scrollContainer.value) {
          //总容器高度变化时更新总容器scrollHeight
          sh1.value = target.scrollHeight;
          ch1.value = target.clientHeight;//这个一般是不会变的，但作为初始化和以防万一还是更新一下
        } else if (target === targetScroll.value) {
          //滑条高度变化时更新滑条高度
          sh2.value = target.scrollHeight;
        } else if (target == dynamic.value) {
          //列表变化会引起总容器高度变化，此时也更新总容器高度
          sh1.value = scrollContainer.value.scrollHeight;
        }
      }
      updateScrollbar();
    });
    resizeObserver.observe(scrollContainer.value);
    resizeObserver.observe(targetScroll.value);
    resizeObserver.observe(dynamic.value);
    scrollContainer.value.addEventListener("scroll", updateScrollbar);
    onBeforeUnmount(() => {
      scrollContainer.value?.removeEventListener("scroll", updateScrollbar);
      resizeObserver.disconnect();
    });
  }
  if (userStore.token) {
    onGetChatVoList({ uid: userStore.userInfo.uid, current: curPage.value, size: 10 }, true);
    curPage.value++;
    canTrigger.value = true;
    if (chatVoList.value.length >= total.value) canUpdateChatDetail.value = false;
  }
});
onBeforeUnmount(() => {
  if (socket.value) socket.value.close();
})
</script>

<style lang="less" scoped>
@import '@/styles/MessageCenter/whisper.less';
</style>