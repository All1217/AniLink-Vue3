<!-- TODO 尝试将部分组件封装成模块，比如clear清空按钮、history-item标签等 -->
<template>
  <!-- 引入常驻的消息中间件 -->
  <!-- <Tube></Tube> -->
  <div :class="is_main_window && scrollFlag ? 'navBar' : 'navBar bgc-w navBar-shadow'">
    <!-- 导航栏内部组件 -->
    <div class="nav-left">
      <ul>
        <li>
          <router-link to="/main_window">
            <img alt="" width="60px" height="28px" src="./assets/images/Video-LOGO.png"
              v-show="!(is_main_window && scrollFlag)" />
            <i class="iconfont icon-xiankuangjiazaishibaidaitiicon fp-little-icon"
              v-show="is_main_window && scrollFlag"></i>
            <span id="first-page" :class="is_main_window && scrollFlag ? 'navBar-b-color' : 'navBar-a-color'"
              @mouseenter="switchDialog('firstPage')">首页&nbsp;
              <i class="iconfont icon-arrow" id="first-page-arrow"></i>
            </span>
          </router-link>
        </li>
        <li><a @click="ElMessage.warning('敬请期待！')"><span
              :class="is_main_window && scrollFlag ? 'jump-left navBar-b-color' : 'jump-left navBar-a-color'">番剧</span></a>
        </li>
        <li><a @click="ElMessage.warning('敬请期待！')"><span
              :class="is_main_window && scrollFlag ? 'jump-left navBar-b-color' : 'jump-left navBar-a-color'">直播</span></a>
        </li>
        <li><a @click="ElMessage.warning('敬请期待！')"><span
              :class="is_main_window && scrollFlag ? 'jump-left navBar-b-color' : 'jump-left navBar-a-color'">游戏中心</span></a>
        </li>
      </ul>
    </div>

    <div class="nav-mid">
      <div ref="searchBox"
        :class="show_search_panel == 1 ? 'search-box shadow bgc-w' : 'search-box bgc-search-box-dark'">
        <div :class="show_search_panel == 1 ? 'app-head' : 'app-head head-bgc'">
          <form>
            <div class="search-content">
              <input type="text" @focus="onSeachFocus" :placeholder="placeHolder" @input="show_clear = 1"
                v-model="search_input" @keydown="onSearchInputStop" maxlength="50">
              <div class="clear" v-show="show_clear == 1" @click="clearSearchInput">
                <el-icon color="var(--white)" size="10">
                  <Close />
                </el-icon>
              </div>
            </div>
            <div class="search-btn" @click="onSearchClick">
              <el-icon size="16" color="#000">
                <Search />
              </el-icon>
            </div>
          </form>
        </div>
        <div class="body" v-show="show_search_panel == 1">
          <div class="search-history">
            <div class="history-head">
              <span class="title">搜索历史</span>
              <span class="clear" @click="onSearchHistoryClear">清空</span>
            </div>
            <div class="history-content">
              <div v-for="item in search_history" class="history-item" :title="item.content"
                :class="{ showItemClear: show_item_clear === item.id }" @mouseenter="show_item_clear = item.id"
                @mouseleave="show_item_clear = -1">
                <span class="history-item-content new-nto-1" @click="onHistoryItemClick(item)">{{ item.content }}</span>
                <div class="history-item-clear" @click="onDelOneSH(item)">
                  <el-icon color="var(--white)" size="12">
                    <Close />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="popular">
            <div class="popular-head">
              <span>当前热搜</span>
            </div>
            <div class="popular-content">
              <div class="pop-content-left">
                <div v-for="(item, index) in hotList" class="pop-title-item" v-show="index % 2 === 0 && index <= 8"
                  @click="onHotSearchClick(item)">
                  <span class="pop-order" :style="(index + 1) <= 3 ? 'color: #18191c;' : 'color:9499a0:'">{{ index + 1
                  }}</span>
                  <span class="pop-title">{{ item.show_name }}</span>
                </div>
              </div>
              <div class="pop-content-right">
                <div v-for="(item, index) in hotList" class="pop-title-item" v-show="index % 2 === 1 && index <= 9"
                  @click="onHotSearchClick(item)">
                  <span class="pop-order" :style="(index + 1) <= 3 ? 'color: #18191c;' : 'color:9499a0:'">{{ index + 1
                  }}</span>
                  <span class="pop-title">{{ item.show_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-right">
      <div class="avatar-box">
        <a class="avatar" v-show="login.isLogin" @mouseenter="switchDialog('user')"
          @click="jumpToUserPage(`/user_page/${userStore.userInfo.uid}`)">
          <img
            :src="userData.avatar ? userData.avatar : DEFAULT_AVATAR"
            alt="">
        </a>
        <div class="un-login" v-show="!login.isLogin" @click="onLoginBtnClick(true, false)">登录</div>
      </div>
      <div>
        <router-link to="/message_center" target="_blank" @mouseenter="switchDialog('message')">
          <el-icon :color="is_main_window && scrollFlag ? 'var(--white)' : '#000'" size="20" class="jump-right">
            <Message />
          </el-icon>
          <span :class="is_main_window && scrollFlag ? 'navBar-b-color' : 'navBar-a-color'">消息</span>
        </router-link>
      </div>
      <div>
        <a @mouseenter="switchDialog('dynamics')" @click="ElMessage.warning('敬请期待！')">
          <el-icon :color="is_main_window && scrollFlag ? 'var(--white)' : '#000'" size="20" class="jump-right">
            <Connection />
          </el-icon>
          <span :class="is_main_window && scrollFlag ? 'navBar-b-color' : 'navBar-a-color'">动态</span>
        </a>
      </div>
      <div>
        <a @click="jumpToUserPage(`/user_page/${userStore.userInfo.uid}/favList`)"
          @mouseenter="switchDialog('collect')">
          <el-icon :color="is_main_window && scrollFlag ? 'var(--white)' : '#000'" size="20" class="jump-right">
            <Star />
          </el-icon>
          <span :class="is_main_window && scrollFlag ? 'navBar-b-color' : 'navBar-a-color'">收藏</span>
        </a>
      </div>
      <div>
        <a @click="jumpToUserPage(`/browseHistory`)" @mouseenter="switchDialog('browsingHistory')">
          <el-icon :color="is_main_window && scrollFlag ? 'var(--white)' : '#000'" size="20" class="jump-right">
            <Clock />
          </el-icon>
          <span :class="is_main_window && scrollFlag ? 'navBar-b-color' : 'navBar-a-color'">历史</span>
        </a>
      </div>
      <div>
        <button class="submit" @click="jumpTo('/upload_manager', true, false, {})">
          <i class="iconfont icon-shangchuan"></i>
          &nbsp;投稿
        </button>
      </div>
    </div>
    <!-- 悬浮窗 -->
    <!-- 首页分区 -->
    <Dialog :dWidth="'608px'" :dHeight="'auto'" :dPos="'top: 70px; left: 40px; background: var(--white);'"
      v-show="show_dialog['firstPage']" @mouseleave="show_dialog['firstPage'] = false">
      <template #body>
        <div class="first-page-dialog">
          <div class="fpd-col">
            <a v-for="(item, index) in partition_list" :key="item.id" @click="ElMessage.warning('敬请期待！')"
              v-show="index % 4 === 0">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="`${item.icon}`"></use>
              </svg>
              <span>{{ item.name }}</span>
            </a>
          </div>
          <div class="fpd-col">
            <a v-for="(item, index) in partition_list" :key="item.id" @click="ElMessage.warning('敬请期待！')"
              v-show="index % 4 === 1">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="`${item.icon}`"></use>
              </svg>
              <span>{{ item.name }}</span>
            </a>
          </div>
          <div class="fpd-col">
            <a v-for="(item, index) in partition_list" :key="item.id" @click="ElMessage.warning('敬请期待！')"
              v-show="index % 4 === 2">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="`${item.icon}`"></use>
              </svg>
              <span>{{ item.name }}</span>
            </a>
          </div>
          <div class="fpd-col">
            <a v-for="(item, index) in partition_list" :key="item.id" @click="ElMessage.warning('敬请期待！')"
              v-show="index % 4 === 3">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="`${item.icon}`"></use>
              </svg>
              <span>{{ item.name }}</span>
            </a>
          </div>
        </div>
      </template>
    </Dialog>
    <!-- 消息 -->
    <Dialog :dWidth="'142px'" :dHeight="'auto'" :dPos="'top: 70px; right: 270px; background: var(--white);'"
      v-show="show_dialog['message']" @mouseleave="show_dialog['message'] = false">
      <template #body>
        <div class="msg-type">
          <router-link :to="{ name: item.link }" v-for="item in unreadType" class="msg-type-item jc-spb">
            <span>{{ item.name }}</span>
            <div class="red-dot" v-show="unread[item.key] > 0"></div>
          </router-link>
        </div>
      </template>
    </Dialog>
    <!-- 动态 -->
    <Dialog :dWidth="'366px'" :dHeight="'auto'" :dPos="'top: 70px; right: 120px; background: var(--white);'"
      v-show="show_dialog['dynamics']" @mouseleave="show_dialog['dynamics'] = false">
      <template #body>
        <div class="dynamics-body">
          <div class="dynamics-head">
            <span class="living">正在直播</span>
            <span class="learn-more">查看更多></span>
          </div>
          <div class="dynamics-living">
            <div v-for="(item, index) in dynamics['LiveS_streaming']" :key="item.id" class="living-user"
              v-show="index <= 4">
              <div class="ablu">
                <el-avatar :size="40" :src="item.src" @error="errorHandler">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
              </div>
              <div class="up-name">{{ item.name }}</div>
            </div>
          </div>
          <div class="divider"><el-divider content-position="center">历史动态</el-divider></div>
          <div class="dynamics-list" v-for="item in dynamics['dynamics']" :key="item.id">
            <div class="dylist-ava">
              <div class="dylist-avaBox">
                <el-avatar :size="36" :src="item.avatar" @error="errorHandler">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
              </div>
            </div>
            <div class="dylist-des">
              <a class="name">{{ item.name }}</a>
              <div class="title nto2">{{ item.title }}</div>
              <span class="time">{{ item.time }}</span>
            </div>
            <div class="dylist-img">
              <div class="img"></div>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
    <!-- 收藏 -->
    <div class="collect-dia-box" v-show="show_dialog['collect']" @mouseleave="show_dialog['collect'] = false">
      <div class="unlogin-dia" v-show="!userStore.token">
        <h2 class="unlogin-dia-title">登陆后即可查看</h2>
        <button class="unlogin-dia-btn" @click="onLoginBtnClick(true, false)">立即登录</button>
      </div>
      <div class="collect-dia" v-show="userStore.token && show_dialog['collect']"
        @mouseleave="show_dialog['collect'] = false">
        <div class="folders">
          <div v-for="(item, index) in favorites_list" @click="onFavorTabClick(item.fid)" class="folders-item"
            v-show="index <= 9" :style="curFid == item.fid ? 'background-color:#00aeec;' : 'background-color:#fff;'">
            <span class="name" :style="curFid == item.fid ? 'color:#fff;' : 'color:#18191c;'">{{ item.title
              }}</span>
            <span class="number" :style="curFid == item.fid ? 'color:#fff;' : 'color:#9499a0;'">{{ item.count
              }}</span>
          </div>
        </div>
        <div class="folder">
          <div class="collected-videos">
            <div class="flex-row-ac jcc"
              v-show="!favoriteTable.has(curFid) || favoriteTable[curFid] == null || favoriteTable[curFid][0].vid == 0">
              <NoData :message1="'该收藏夹暂无视频！'" :img-type="2"></NoData>
            </div>
            <a @click="onCollectVideoClick(item)" v-for="(item, index) in favoriteTable[curFid]" class="collected-item"
              v-show="item.vid > 0 && index <= 14">
              <div class="img">
                <img :src="item.coverUrl" alt="" class="collected-item-img">
                <span class="tag time-tag">{{ formatTimeGap(item.duration) }}</span>
              </div>
              <div class="des">
                <div class="title">{{ item.title }}</div>
                <div class="name">
                  <i class="iconfont icon-UPzhu"></i>&nbsp;
                  <span>{{ item.nickname }}</span>
                </div>
              </div>
            </a>
          </div>
          <div class="operate">
            <a @click="jumpToUserPage(`/user_page/${userStore.userInfo.uid}/favList`)">查看全部</a>
            <a class="play-all" @click="ElMessage.warning('敬请期待！')"><i
                class="iconfont icon-bofangqi-bofang"></i>&nbsp;播放全部</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 浏览历史 -->
    <Dialog :dWidth="'370px'" :dHeight="'auto'" :dPos="'top: 70px; right: 80px; background: var(--white);'"
      v-show="show_dialog['browsingHistory']" @mouseleave="show_dialog['browsingHistory'] = false">
      <template #body>
        <HistoryDialog :can-get-history="show_dialog['browsingHistory']"></HistoryDialog>
      </template>
    </Dialog>
    <!-- 个人 -->
    <Dialog :dWidth="'300px'" :dHeight="'auto'" :dPos="'top: 70px; right: 300px; background: var(--white);'"
      v-show="userData && show_dialog['user']" @mouseleave="show_dialog['user'] = false">
      <template #body>
        <div class="user-panel">
          <a class="nick-name" @click="jumpToUserPage(`/user_page/${userStore.userInfo.uid}`)">{{ userData.nickname
            }}</a>
          <a>uid: {{ userData.uid }}</a>
          <div class="account">
            <span>硬币：</span>
            <a>{{ userData.coin }}&nbsp;&nbsp;</a>
            <span>V币：</span>
            <a>0</a>
          </div>
          <div class="socialize">
            <div class="socialize-item">
              <div @click="jumpTo(`/user_page/${userStore.userInfo.uid}/fansList`, true, true, { mode: 0 })"
                class="count">{{ formatCount(userStats.followCount) }}</div>
              <div @click="jumpTo(`/user_page/${userStore.userInfo.uid}/fansList`, true, true, { mode: 0 })"
                class="socialize-type">关注</div>
            </div>
            <div class="socialize-item">
              <div @click="jumpTo(`/user_page/${userStore.userInfo.uid}/fansList`, true, true, { mode: 0 })"
                class="count">{{ formatCount(userStats.fansCount) }}</div>
              <div class="socialize-type"
                @click="jumpTo(`/user_page/${userStore.userInfo.uid}/fansList`, true, true, { mode: 1 })">粉丝</div>
            </div>
            <div class="socialize-item">
              <div class="count">0</div>
              <div class="socialize-type">动态</div>
            </div>
          </div>
          <router-link :to="`/user_page/${userStore.userInfo.uid}`" target="_blank" class="details">
            <div>
              <i class="iconfont icon-yonghu"></i>&nbsp;
              <span>个人中心</span>
            </div>
            <i class="iconfont icon-gengduo details-right-arrow"></i>
          </router-link>
          <router-link to="/upload_manager" target="_blank" class="details">
            <div>
              <i class="iconfont icon-tougaoguanli"></i>&nbsp;
              <span>投稿管理</span>
            </div>
            <i class="iconfont icon-gengduo details-right-arrow"></i>
          </router-link>
          <a href="" class="details">
            <div>
              <i class="iconfont icon-shoucang"></i>&nbsp;
              <span>推荐服务</span>
            </div>
            <i class="iconfont icon-gengduo details-right-arrow"></i>
          </a>
          <el-divider style="margin: 15px 0;" />
          <a class="details" @click="callLogout">
            <div>
              <i class="iconfont icon-tuichudenglu"></i>&nbsp;
              <span>退出登录</span>
            </div>
            <i class="iconfont icon-gengduo details-right-arrow"></i>
          </a>
        </div>
      </template>
    </Dialog>
  </div>
  <div id="login-dialog" class="flex-row-ac jcc" v-show="login.dialog">
    <div class="bili-mini-content-wp flex-row jcc"
      :style="login.isInputPass ? `background-image:url(${lp}),url(${rp});` : `background-image:url(${lunp}),url(${runp});`">
      <div class="bili-mini-close-icon" @click="login.dialog = false"></div>
      <div class="login-scan-wp flex-col-ac">
        <div class="login-scan-title">扫描二维码登录</div>
        <div class="login-scan-hover-wp flex-row-ac jcc">TODO</div>
        <div class="login-scan-desc">
          <p>TODO</p>
        </div>
      </div>
      <div class="bili-mini-line"></div>
      <div class="bili-mini-login-right-wp flex-col-ac">
        <div class="login-tab-wp flex-row jcc">
          <div :class="login.isReg ? 'login-tab-item unac' : 'login-tab-item ac'" @click="login.isReg = false">密码登录
          </div>
          <div class="login-tab-line"></div>
          <div :class="login.isReg ? 'login-tab-item ac' : 'login-tab-item unac'" @click="login.isReg = true">注册</div>
        </div>
        <div class="login-pwd-wp">
          <form class="tab__form" v-show="!login.isReg">
            <div class="form__item flex-row-ac jc-start">
              <div class="form_info">账号</div>
              <input type="text" autocomplete="on" maxlength="15" oninput="value=value.replace(/\s+/g, '')"
                placeholder="请输入账号" v-model="login.account"
                @keydown="(e: KeyboardEvent) => { if (e.key === 'Enter') loginPassInput.focus() }">
            </div>
            <div class="form__separator-line"></div>
            <div class="form__item flex-row-ac jc-start">
              <div class="form_info">密码</div>
              <input ref="loginPassInput" type="password" autocomplete="on" maxlength="16"
                oninput="value=value.replace(/\s+/g, '')" placeholder="请输入密码" @focus="login.isInputPass = true"
                @blur="login.isInputPass = false" v-model="login.password"
                @keydown="(e: KeyboardEvent) => { if (e.key === 'Enter') callLogin() }">
            </div>
          </form>
          <form class="tab__form" v-show="login.isReg">
            <div class="form__item flex-row-ac jc-start">
              <div class="form_info">昵称</div>
              <input type="text" autocomplete="on" maxlength="20" oninput="value=value.replace(/\s+/g, '')"
                placeholder="请输入用户名" v-model.trim="login.username"
                @keydown="(e: KeyboardEvent) => { if (e.key === 'Enter') registerPassLogin.focus() }">
            </div>
            <div class="form__separator-line"></div>
            <div class="form__item flex-row-ac jc-start">
              <div class="form_info">密码</div>
              <input ref="registerPassLogin" type="password" autocomplete="on" maxlength="16"
                oninput="value=value.replace(/\s+/g, '')" placeholder="请输入密码" @focus="login.isInputPass = true"
                @blur="login.isInputPass = false" v-model="login.password"
                @keydown="(e: KeyboardEvent) => { if (e.key === 'Enter') callRegister() }">
            </div>
          </form>
          <div :class="login.isReg ? 'btn_wp flex-row jcc' : 'btn_wp flex-row jc-spb'">
            <div class="btn_other" v-show="!login.isReg" @click="onLoginBtnClick(true, true)">注册</div>
            <div class="btn_other" v-show="login.isReg" @click="callRegister">注册</div>
            <div class="btn_primary" v-show="!login.isReg" @click="callLogin">登录</div>
          </div>
        </div>
      </div>
      <div class="login-agreement-wp">
        <p>TODO——TODO——</p>
        <p>TODO——TODO——TODO——TODO——</p>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { ElMessage, ElNotification } from "element-plus";

import { ref, onMounted, onBeforeUnmount, reactive, watch, computed } from "vue";
import { useRouter, LocationQueryRaw, RouterLink } from 'vue-router';

import Dialog from "./components/Dialog.vue";
import lp from '@/assets/images/login_password_left.png';
import rp from '@/assets/images/login_password_right.png';
import lunp from '@/assets/images/login_left_image.png';
import runp from '@/assets/images/login_right_image.png';
import { useUserStore } from '@/util/userStore'
import { validateAccount, validatePass, formatTimeGap, formatCount, removeOneElement } from "./util";
import { LOGIN_URL } from "./util/config";
import {DEFAULT_AVATAR} from "@/api/constants"

import {
  partitonList, Partition, defaultUser, onLogin,
  getUserInfoByUid, onRegister, getWhisperUnread, DefaultUserStats
  , SearchHistory, HotSearch,
  getHotSearch
} from '@/api/app'
import { getFavoriteList, getVideoInfavor } from '@/api/favorite'
import { UserStatsQueryVo } from "./api/UserPage/types";
import { getUserStatsByUid } from '@/api/UserPage/index'
import { Favorite, User, UserStats, VideoVo } from '@/api/Models';
import NoData from "./components/NoData.vue";
import HistoryDialog from "./components/App/HistoryDialog.vue";
const userStore = useUserStore();
const router = useRouter();
//分区列表
const partition_list = ref<Partition[]>(partitonList)
const searchBox = ref<HTMLDivElement | null>(null)

/**
 * @description: 登录&注册
 */
//登录项
const login = reactive({
  account: "",
  password: "",
  username: "",
  dialog: false,
  isLogin: false,//是否已登录
  isPassword: true,
  isReg: false,
  isInputPass: false
})
const loginPassInput = ref<HTMLInputElement | null>(null)
const registerPassLogin = ref<HTMLInputElement | null>(null)

const show_search_panel = ref(-1)
const show_clear = ref(-1)
const show_dialog = reactive({
  firstPage: false,
  message: false,
  dynamics: false,
  collect: false,
  browsingHistory: false,
  user: false,
})
//请求
async function callLogin() {
  if (!validateAccount(login.account)) {
    ElMessage.error("账号不符合格式，必须是15位以内纯数字！")
    return;
  }
  if (!validatePass(login.password)) {
    ElMessage.error("密码不符合要求，必须是6~16位,且只能由字母、数字、“,.!/”组成！")
    return;
  }
  try {
    const res = await onLogin({ username: login.account, password: login.password })
    if (res.code == 200) {
      login.isLogin = true
      userStore.setToken(res.data)
      login.dialog = false
      const userD = await getUserInfoByUid()
      ElNotification({
        title: '提示：',
        message: `您的UID为：${userD.data.uid}，请记住该UID，它是您下次登录时需要输入的账号。`,
        type: 'warning',
        duration: 0
      })
      userStore.setUserInfo(userD.data)
      userData.value = userStore.userInfo
      onGetUnread()
      onGetFavoriteList(userStore.userInfo.uid)
      onGetUserStatsByUid({ uid: userStore.userInfo.uid })
    } else {
      console.log('fail-login-res: ', res)
      ElMessage.error('登录失败！')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('登录失败！')
  }
}
async function callLogout() {
  login.isLogin = false
  search_history.value = []
  userStore.Logout()
  router.replace(LOGIN_URL)
}
async function callRegister() {
  if (!validatePass(login.password)) {
    ElMessage.error("密码不符合要求，必须是6~16位,且只能由字母、数字、“,.!/”组成！")
    return;
  }
  try {
    const tPass = login.password;
    const res = await onRegister({ nickname: login.username, password: login.password })
    if (res.code == 200) {
      login.account = res.data
      login.password = tPass
      callLogin()
    }
  } catch (error) {
    ElMessage.error('注册失败！')
  }
}
/**
 * @description: 搜索&搜索历史
 */
//热搜列表
const hotList = ref<HotSearch[]>([])
//输入框绑定
const placeHolder = ref("某知名UP主 1小时前更新")
const search_input = ref<string>("")
const show_item_clear = ref(-1)//当前显示删除图标的搜索历史标签
//搜索历史flag
const search_history = ref<SearchHistory[]>([])
function onSeachFocus() {
  show_search_panel.value = 1
  if (userStore.token) {
    search_history.value = userStore.sh;
    search_history.value.sort((e1, e2) => {
      return e2.cnt - e1.cnt
    })
  }
}
function onSearchHistoryClear() {
  search_history.value = []
  if (userStore.token) userStore.sh = [];
}
function onSearchClick() {
  if (search_input.value.length == 0) return;
  handleSearchHistory();
  //页面跳转
  jumpTo('/searchResult/all', true, true, { keyword: search_input.value })
}
function handleSearchHistory() {
  //处理搜索历史
  let flag = false;
  search_history.value.some(e => {//先在目前的搜索历史列表里找有没有这个词
    if (e.content === search_input.value) {
      const now = new Date();
      //找到的话将它的最近使用时间修改到当前
      e.cnt = now.getTime();
      flag = true;
    }
  })
  if (!flag) {//没找到就插入新搜索历史
    const now = new Date();
    search_history.value.push({ id: now.getTime(), content: search_input.value, cnt: now.getTime() });
  }
  let res = search_history.value.sort((e1, e2) => {//将搜索历史按最近使用时间降序排序
    return e2.cnt - e1.cnt
  })
  if (search_history.value.length > 20) search_history.value.pop();//如果总数大于20个则删除末尾
  if (userStore.token) userStore.sh = res;//保存至浏览器缓存
  search_history.value.push()
}
function onDelOneSH(e: SearchHistory) {
  search_history.value = removeOneElement(search_history.value, (t: SearchHistory) => {
    return t.id == e.id;
  })
  if (userStore.token) userStore.sh = search_history.value;
}
function onHistoryItemClick(e: SearchHistory) {
  search_input.value = e.content;
  const now = new Date();
  e.cnt = now.getTime();
  if (userStore.token) userStore.sh = search_history.value;
  jumpTo('/searchResult/all', true, true, { keyword: search_input.value })
}
function onHotSearchClick(e: HotSearch) {
  let url = `https://search.bilibili.com/all?keyword=${e.keyword}&from_source=webtop_search&spm_id_from=333.1007&search_source=4`
  window.open(url, '_blank');
}
async function onGetHotSearch() {
  try {
    const res = await getHotSearch();
    if (res.code == 200 && res.data != null) hotList.value = res.data;
  } catch (error) {
    console.log(error);
  }
}
//动态列表
const dynamics = ref({
  LiveS_streaming: [{ id: 1, name: "某用户", src: "" }, { id: 1, name: "某用户", src: "" }, { id: 1, name: "某用户", src: "" }, { id: 1, name: "某用户", src: "" }, { id: 1, name: "某用户", src: "" }],
  dynamics: [{ id: 1, name: "某用户", src: "", avatar: "", title: "敬请期待！", time: "36分钟前" }]
})
/**
 * @description: 未读消息
 */
// 消息类型列表
const unreadType = ([
  { id: 1, name: "回复我的", link: "", key: 'reply' },
  { id: 2, name: "@我的", link: "", key: 'at' },
  { id: 3, name: "收到的赞", link: "", key: 'love' },
  { id: 4, name: "系统消息", link: "MC_system", key: 'system' },
  { id: 5, name: "我的消息", link: "MC_whisper", key: 'whisperUnread' },
])
const unread = reactive({
  whisperUnread: 0,
  system: 0,
  love: 0,
  at: 0,
  reply: 0,
})
function onGetUnread() {
  if (!userStore.token) {
    ElMessage.error('未登录！')
    return;
  }
  onGetWhisperUnread()
}
async function onGetWhisperUnread() {
  try {
    const res = await getWhisperUnread({ uid: userStore.userInfo.uid })
    unread.whisperUnread = res.data;
  } catch (error) {
    console.log(error)
  }
}
/**
 * @description: 收藏管理功能区
 */
const curFid = ref<number>(0)//当前选中收藏夹
//收藏夹列表
const favorites_list = ref<Favorite[]>([])
//value为null表示未初始化数据，可能需要发请求获取
//value为[{ fid: 0, uid: 0, type: 0, visible: 0, cover: 0, title: 0, description: 0, count: 0, is_delete: 0 }]表示空列表
let favoriteTable = ref<Map<number, VideoVo[]>>(new Map());//收藏夹与收藏夹内视频列表映射
function initFavorList() {
  if (favorites_list.value.length == 0) return;
  favorites_list.value.forEach((e) => {
    if (!favoriteTable.value) favoriteTable.value = new Map();
    favoriteTable.value.set(e.fid, null);
  })
  onGetVideoInFavor(favorites_list.value[0].fid, true)
}
function onFavorTabClick(fid: number) {
  if (favoriteTable.value.has(fid) && favoriteTable.value[fid] == null) {//未获取数据
    onGetVideoInFavor(fid, true);
  } else {
    curFid.value = fid;
  }
}
function onCollectVideoClick(e: VideoVo) {
  if (e.vid == 0) return;
  jumpTo(`/video/${e.vid}`, true, false, null)
}
async function onGetVideoInFavor(fid: number, isInit: boolean) {
  try {
    const { data } = await getVideoInfavor(fid)
    if (data.length > 0) favoriteTable.value[fid] = data;
    else {
      //用这个数据区分未获取数据和空列表
      favoriteTable.value[fid] = [{ uid: 0, nickname: 'string', title: 'string', duration: 1, coverUrl: 'string', uploadDate: 'string', vid: 0, play: 0, danmu: 0, good: 0, coin: 0 }]
    }
    if (isInit) curFid.value = fid;
  } catch (error) {
    console.log(error)
  }
}
async function onGetFavoriteList(uid: number) {
  try {
    const { data } = await getFavoriteList({ uid: uid, current: 1, size: 100 })
    favorites_list.value = data.records;
    initFavorList();
  } catch (error) {
    console.log(error)
  }
}
/**
 * @description: 用户管理
 */
const userData = ref<User>(defaultUser)
const userStats = ref<UserStats>(DefaultUserStats)
async function onGetUserStatsByUid(query: UserStatsQueryVo) {
  try {
    const res = await getUserStatsByUid(query)
    userStats.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const handleOutSearchbox = (event: MouseEvent) => {
  if (searchBox.value && !searchBox.value.contains(event.target as Node)) {
    show_search_panel.value = -1
  }
}
function onLoginBtnClick(showLoginPanel: boolean, showReg: boolean) {
  login.dialog = showLoginPanel
  login.isReg = showReg
  login.account = ""
  login.password = ""
  login.username = ""
}
function jumpToUserPage(path: string) {
  if (userStore.token) {
    jumpTo(path, true, true, { uid: userStore.userInfo.uid, source: 1 })
  }
}
function onSearchInputStop(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    (event.target as HTMLInputElement).blur();
    handleSearchHistory();
    jumpTo('/searchResult/all', true, true, { keyword: search_input.value })
  }
}
//页面跳转
function jumpTo(href: string, isBlank: boolean, isQuery: boolean, query: LocationQueryRaw) {
  const url = router.resolve({
    path: href,
    query: isQuery ? query : null
  });
  if (isBlank) {
    window.open(url.href, "_blank");
  } else {
    window.open(url.href);
  }
}
function clearSearchInput() {
  search_input.value = "";
  show_clear.value = -1;
}
//头像加载失败
function errorHandler() {
  return true;
}
function resetFlag() {
  if (favorites_list.value.length > 0) curFid.value = favorites_list.value[0].fid;
  else curFid.value = 0;
  show_item_clear.value = -1
  show_search_panel.value = -1
  show_clear.value = -1
}
function switchDialog(selected: string) {
  resetFlag();
  //打开其中一个悬浮窗前，关闭其他所有悬浮窗
  for (let key in show_dialog) {
    if (key !== selected) {
      show_dialog[key] = false;
    } else {
      show_dialog[key] = true;
    }
  }
}

const is_main_window = ref(false)
const scrollFlag = ref(true)
function onBodyScroll(e: any) {
  let scrollTop = e.target.scrollingElement.scrollTop;
  if (is_main_window && scrollFlag && scrollTop >= 100) {
    scrollFlag.value = false
  } else if (is_main_window && scrollFlag && scrollTop < 100) {
    scrollFlag.value = true
  }
}
onMounted(() => {
  document.addEventListener('click', handleOutSearchbox);
  window.addEventListener("scroll", onBodyScroll);
  favoriteTable.value.set(0, [])
  if (!userStore.token) {
    login.isLogin = false
  } else {
    login.isLogin = true
    userData.value = userStore.userInfo
    search_history.value = userStore.sh
    onGetUnread()
    onGetFavoriteList(userStore.userInfo.uid);
    onGetUserStatsByUid({ uid: userStore.userInfo.uid })
    onGetHotSearch()
  }
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onBodyScroll);
  window.removeEventListener('click', handleOutSearchbox);
})
watch(() => router.currentRoute.value.path, (toPath) => {
  window.scrollTo({
    top: 0,
  });
  if (toPath == "/main_window") {
    is_main_window.value = true;
  }
  else {
    is_main_window.value = false;
  }
}, { immediate: true, deep: true }
)
</script>

<style scoped lang="less">
@import '@/styles/app.less';

.not-password {
  background-image: url(./assets/images/login_left_image.png), url(./assets/images/login_right_image.png);
}

.password {
  background-image: url(./assets/images/login_left_image.png), url(./assets/images/login_right_image.png);
}
</style>