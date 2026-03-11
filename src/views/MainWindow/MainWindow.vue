<template>
  <div class="MainWindow-container">
    <div class="back-ground-img">
      <img src="../../assets/images/首页背景图.jpg" alt="" width="100%" height="155px" style="object-fit: cover;">
      <img alt="" width="162px" height="78px" class="LOGO" src="../../assets/images/BILIBILI_LOGO.png" />
    </div>
    <div class="long-box">
      <!-- 首页分区 -->
      <div class="partition">
        <div class="left-icons">
          <a @click="openNewPage('https://t.bilibili.com/?spm_id_from=333.1007.0.0', true)">
            <div class="dynamic"><i class="iconfont icon-dongtai"></i></div>
            <span>动态</span>
          </a>
          <a @click="openNewPage('https://www.bilibili.com/v/popular/all?spm_id_from=333.1007.0.0', true)">
            <div class="popular"><i class="iconfont icon-remen"></i></div>
            <span>热门</span>
          </a>
        </div>
        <div class="right-channel-container">
          <div class="channel-items-left">
            <a v-for="e, index in partitonList" v-show="index <= 20" @click="openNewPage(e.link, true)">
              {{ e.name }}
            </a>
            <a @click="ElMessage.warning('敬请期待！')">更多&nbsp;<i class="iconfont icon-arrow"></i></a>
          </div>
          <div class="channel-items-right">
            <a v-for="item in partition_right" :key="item.id" @click="ElMessage.warning('敬请期待！')">
              <i :class="`iconfont ${item.icon}`"></i>&nbsp;{{ item.name }}
            </a>
          </div>
        </div>
      </div>
      <!-- 轮播图&顶部推荐视频列表 -->
      <div class="slide">
        <div class="feed-roll-btn">
          <button class="roll-btn flex-col-ac jcc" @click="onRollBtnClick">
            <el-icon>
              <RefreshLeft />
            </el-icon>
            <span>换一换</span>
          </button>
        </div>
        <div class="left">
          <div class="slide-bar"
            :style="`transform: translateX(${cur_pic * -545}px);background-color:${slide_picture[cur_pic].style};`"
            @click="openNewPage(slide_picture[cur_pic].href, true)">
            <img v-for="img in slide_picture" :src="img.src" :alt="img.alt" class="slide-picture">
          </div>
          <div class="bottom" @click="openNewPage(slide_picture[cur_pic].href, true)"
            :style="`background: linear-gradient(to top, ${slide_picture[cur_pic].style}, transparent);`"></div>
          <ul>
            <li v-for="li, index in slide_picture" :key="index"
              :class="cur_pic == index ? 'selected-slide-pic' : 'unselected-slide-pic'" @click="cur_pic = index">
            </li>
          </ul>
          <a :href="slide_picture[cur_pic].href" target="_blank">{{ slide_picture[cur_pic].title }}</a>
          <div class="button">
            <button @click="changeSlide(-1)"><i class="iconfont icon-fanhui"></i></button>
            <button @click="changeSlide(1)"><i class="iconfont icon-gengduo"></i></button>
          </div>
        </div>
        <div class="right">
          <div v-for="item in slide_r_videos" class="video-card">
            <div class="img" @click="onVideoClick(item)">
              <img :src="item.coverUrl" alt="">
              <div class="video-info">
                <div>
                  <span><i class="iconfont icon-bofangshu"></i>&nbsp;{{ formatCount(item.play)
                  }}&nbsp;&nbsp;&nbsp;</span>
                  <span><i class="iconfont icon-danmushu"></i>&nbsp;{{ formatCount(item.danmu) }}</span>
                </div>
                <span>{{ formatTimeGap(item.duration) }}</span>
              </div>
            </div>
            <h3 class="title">
              <a @click="onVideoClick(item)" class="force-line-breaks">{{ item.title }}</a>
            </h3>
            <div class="up-time">
              <a href="">
                <i class="iconfont icon-UPzhu"></i>&nbsp;
                <span @click="jumpToUserPage(item.uid)">
                  {{ `${item.nickname} • ${sliceDateTime(item.uploadDate)}` }}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 分区入口&瀑布流视频列表 -->
      <template v-for="(par, index) in avaPar" v-show="index <= 2 && index < parEntrance.length">
        <div class="gap" v-show="index <= 2"></div>
        <div class="s-partition" v-if="index <= 2">
          <div class="left" v-for="e in videoWall.slice(index * 4, index * 4 + 4)">
            <div class="video-card">
              <div class="img" @click="onVideoClick(e)">
                <img :src="e.coverUrl" alt="">
                <div class="video-info">
                  <div>
                    <span><i class="iconfont icon-bofangshu"></i>&nbsp;{{ formatCount(e.play)
                    }}&nbsp;&nbsp;&nbsp;</span>
                    <span><i class="iconfont icon-danmushu"></i>&nbsp;{{ formatCount(e.danmu) }}</span>
                  </div>
                  <span>{{ formatTimeGap(e.duration) }}</span>
                </div>
              </div>
              <h3 class="title" @click="onVideoClick(e)">
                <a href="" class="force-line-breaks">{{ e.title }}</a>
              </h3>
              <div class="up-time">
                <a @click="jumpToUserPage(e.uid)">
                  <i class="iconfont icon-UPzhu"></i>&nbsp;
                  <span>{{ `${e.nickname} • ${e.uploadDate.split(' ')[0]}` }}</span>
                </a>
              </div>
            </div>
          </div>
          <!-- 右边分区入口 -->
          <div class="partition-entrance">
            <div class="layer1"></div>
            <div class="layer2"></div>
            <div class="img" @click="onParEntrance(parEntrance[index].href)">
              <img :src="parEntrance[index].cover" alt="">
              <div class="type-tag">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="`${par.icon}`"></use>
                </svg>
                <span class="type-name">{{ par.name }}</span>
              </div>
            </div>
            <div class="pe-bottom-box">
              <p class="force-line-breaks" @click="onParEntrance(parEntrance[index].href)">{{ parEntrance[index].title
              }}</p>
              <a @click="onParEntrance(parEntrance[index].href)">
                <span>{{ parEntrance[index].des }}</span>
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

import { partitonList, avaPar } from '@/api/app';
import { VideoVo, VideoQueryVo } from "@/api/Models";
import { ParRight, PopularWork } from "@/api/MainWindow/types";
import { deRVL, getRecVideoList, slide_picture, parVideoList } from '@/api/MainWindow/index'
import { formatTimeGap, formatCount, sliceDateTime, openNewPage } from '@/util/index'

var slide_pic = null
const wallPage = ref<number>(1)
const cur_pic = ref<number>(0)
const router = useRouter()
const partition_right: ParRight[] = [
  { id: 1, name: "专栏", icon: "icon-zhuti" },
  { id: 2, name: "活动", icon: "icon-zhuti" },
  { id: 3, name: "直播", icon: "icon-zhuti" },
  { id: 4, name: "课堂", icon: "icon-zhuti" },
  { id: 5, name: "社区中心", icon: "icon-zhuti" },
  { id: 6, name: "新歌热榜", icon: "icon-zhuti" },
]
const slide_r_videos = ref<VideoVo[]>(deRVL)
const videoWall = ref<VideoVo[]>(parVideoList)
const parEntrance = ref<PopularWork[]>([
  {
    cover: "https://morton321.oss-cn-hangzhou.aliyuncs.com/%E7%A5%9E%E4%B9%8B%E5%A1%94.png", title: "神之塔 工房战", des: "更新至第12话  · 周一更新",
    href: 'https://www.bilibili.com/bangumi/play/ep1178228?spm_id_from=333.1007.partition_recommend.content.click'
  },
  { cover: "https://morton321.oss-cn-hangzhou.aliyuncs.com/%E4%BA%AC%E4%B8%9C%E5%A9%9A%E4%BB%8B%E6%89%80.png", title: "90婚介所2022", des: "找到心仪的TA ", href: 'https://www.bilibili.com/bangumi/play/ss41673?spm_id_from=333.1007.partition_recommend.content.click' },
  { cover: "https://morton321.oss-cn-hangzhou.aliyuncs.com/%E7%9B%9F%E5%86%9B%E6%95%A2%E6%AD%BB%E9%98%9F.png", title: "【盟军敢死队】 中文版", des: "哔哩哔哩电影", href: 'https://www.bilibili.com/bangumi/play/ep835772?theme=movie&spm_id_from=333.1007.partition_recommend.content.click' },
  { cover: "https://morton321.oss-cn-hangzhou.aliyuncs.com/%E6%BC%AB%E7%94%BB.png", title: "杀死男主然后成为女魔头 | 当游戏中的角色，窥视到了游戏外的世界", des: "古风 · 更新至请假公告", href: "https://manga.bilibili.com/detail/mc32716?spm_id_from=333.1007.partition_recommend.content.click" }
])
/**
 * @description: 函数&方法
 * @returns {*}
 */
function changeSlide(num: number) {
  if (num < 0) {
    cur_pic.value = cur_pic.value == 0 ? 8 : cur_pic.value + num;
  } else {
    cur_pic.value = cur_pic.value == 8 ? 0 : cur_pic.value + num;
  }
}
function onVideoClick(e: VideoVo) {
  if (e.vid == 0) {
    return;
  }
  let url = router.resolve({ path: `/video/${e.vid}` });
  window.open(url.href, "_blank");
}
function jumpToUserPage(uid: number) {
  const url = router.resolve({
    name: 'UserPage',
    params: { uid: uid }
  });
  window.open(url.href, "_blank");
}
function onGetVideoWall(count: number) {
  getVideoList({
    current: wallPage.value,
    size: count,
  })
}
function onParEntrance(href: string) {
  window.open(href, "_blank")
}
/**
 * @description: 轮播图右侧推荐视频栏
 */
const curRecVideoListPage = ref<number>(1);
function onRollBtnClick() {
  curRecVideoListPage.value++;
  callGetRecVideoList()
}
async function callGetRecVideoList() {
  try {
    const res = await getRecVideoList({
      current: curRecVideoListPage.value,
      size: 6,
    })
    if (res.data.records.length < 6) {
      ElMessage.warning('当前列表视频数量不足以填充视图，下次点击将重回第一页！');
      curRecVideoListPage.value = 0;
      return;
    }
    slide_r_videos.value = res.data.records
  } catch (error) {
    console.log(error)
  }
}
async function getVideoList(query: VideoQueryVo) {
  try {
    const { data } = await getRecVideoList(query)
    if (videoWall.value.length == 0) {
      videoWall.value = data.records
    } else {
      videoWall.value.concat(data.records)
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  slide_pic = setInterval(() => {
    cur_pic.value = cur_pic.value == 8 ? 0 : cur_pic.value + 1;
  }, 5000);
  callGetRecVideoList()
  onGetVideoWall(12)
})
onBeforeUnmount(() => {
  clearInterval(slide_pic);
})
</script>
<style lang="less" scoped>
.selected-slide-pic {
  width: 12px;
  height: 12px;
  margin: 4px;
  background-color: rgba(255, 255, 255, 1);
}

.unselected-slide-pic {
  width: 8px;
  height: 8px;
  margin: 4px;
  background-color: rgba(255, 255, 255, 0.4);
}

.long-box .partition,
.long-box .partition .right-channel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.long-box .partition .left-icons a div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.force-line-breaks {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-break: break-word !important;
  line-break: anywhere;
  -webkit-line-clamp: 2;
  cursor: pointer;
}

//主盒子
.MainWindow-container {
  height: auto;
}

//背景图
.back-ground-img {
  z-index: 1;
  position: relative;
  height: 155px;

  .LOGO {
    z-index: 2;
    position: absolute;
    bottom: 15px;
    left: 60px;
  }
}

.long-box {
  min-width: 1367px;
  max-width: 1700px;
  width: 1400px;
  height: auto;
  padding-bottom: 30px;
  margin: 0 auto;

  .gap {
    height: 60px;
  }

  .partition {
    width: 100%;
    height: 110px;

    .left-icons {
      display: flex;
      width: 140px;
      height: 72px;
      margin-right: 8px;

      .dynamic {
        background-color: #ff9212;
      }

      .dynamic:hover {
        background-color: #fba849;
      }

      .popular {
        background-color: #f07775;
      }

      .popular:hover {
        background-color: #ff9391;
      }

      a {
        display: flex;
        flex-direction: column;
        width: 46px;
        height: 72px;
        margin-right: 24px;
        color: var(--font-color-black);

        div {
          width: 46px;
          height: 46px;
          margin: 0 0 6px 0;
          border-radius: 50%;
          transition: background 0.3s;

          i {
            color: var(--white);
            font-size: 24px;
          }
        }

        span {
          width: 46px;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
        }
      }
    }

    .right-channel-container {
      width: calc(100% - 148px);
      height: 66px;

      a {
        width: 100%;
        text-align: center;
        font-weight: 400;
        transition: background-color 0.3s, color 0.3s;
        font-size: 14px;
      }

      .channel-items-left {
        display: grid;
        grid-template-columns: repeat(11, 1fr);
        grid-auto-flow: column;
        grid-column: span 4;
        grid-gap: 10px;
        grid-template-rows: repeat(2, 1fr);
        width: 100%;
        height: 66px;
        padding-right: 30px;
        border-right: 1px solid var(--bgc1);

        a {
          display: inline-block;
          height: 26px;
          line-height: 26px;
          border-radius: 6px;
          background-color: var(--bgc3);
          color: var(--font-color-gray2);
        }

        a:hover {
          background-color: var(--bgc1);
          color: var(--font-color-black);
        }
      }

      .channel-items-right {
        display: grid;
        grid-row-gap: 10px;
        grid-auto-flow: column;
        grid-template-rows: repeat(2, 1fr);
        flex-shrink: 0;
        min-width: 240px;
        width: 240px;
        height: 66px;

        a {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 28px;
          line-height: 28px;
          color: var(--font-color-gray2);
        }

        a:hover {
          color: var(--hover-blue);
        }
      }
    }
  }

  //轮播图
  .slide {
    position: relative;
    display: flex;
    width: 100%;
    height: 466px;

    .feed-roll-btn {
      position: absolute;
      left: 100%;
      top: 0;
      z-index: 2;
      transform: translate(10px);

      .roll-btn {
        margin-left: 0;
        height: auto;
        width: 40px;
        padding: 9px;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #e3e5e7;
        cursor: pointer;

        span {
          font-size: 12px;
          color: #18191c;
        }
      }
    }

    .left {
      position: relative;
      height: 386px;
      width: 545px;
      border-radius: 8px;
      overflow: hidden;

      .slide-bar {
        position: absolute;
        top: 0px;
        display: flex;
        height: 100%;
        width: 4905px;
        transition: transform 0.3s ease;

        .slide-picture {
          width: 545px;
          height: 307px;
          object-fit: cover;
        }
      }

      .bottom {
        position: absolute;
        bottom: 78px;
        height: 110px;
        width: 100%;
        transition: all .2s;
      }

      ul {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 15px;
        left: 15px;
      }

      ul li {
        display: inline-block;
        cursor: pointer;
        border-radius: 50%;
      }

      a {
        position: absolute;
        left: 19px;
        bottom: 45px;
        width: auto;
        height: auto;
        font-size: 18px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .button {
        position: absolute;
        display: flex;
        justify-content: space-between;
        width: 68px;
        height: 28px;
        right: 15px;
        bottom: 42px;

        button {
          align-items: center;
          justify-content: center;
          display: flex;
          width: 28px;
          height: 28px;

          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.1);

          i {
            font-size: 12px;
            color: var(--white);
          }
        }

        button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .right {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-gap: 20px;
      width: calc(100% - 545px);
      height: 100%;
      padding: 0 0 0 20px;
    }
  }

  //单个分区视频
  .s-partition {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    width: 100%;
    height: 240px;

    .left {
      width: 100%;
      height: 100%;
      padding-bottom: 16px;
    }

    .partition-entrance {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: var(--white);
      border: 1px solid var(--bgc1);
      border-radius: 8px;

      .layer1 {
        position: absolute;
        top: 6px;
        left: 5%;
        height: 100%;
        width: 90%;
        background-color: var(--bgc4);
        border-radius: 6px;
        z-index: -1;
      }

      .layer2 {
        position: absolute;
        top: 12px;
        left: 10%;
        height: 100%;
        width: 80%;
        background-color: var(--bgc5);
        border-radius: 6px;
        z-index: -2;
      }

      .img {
        position: relative;
        width: 100%;
        height: 147px;
        border-radius: 8px;
        background-color: var(--black);
        z-index: 10;

        img {
          width: 100%;
          height: 147px;
          object-fit: cover;
        }

        .type-tag {
          position: absolute;
          left: 6px;
          top: 6px;
          height: 27px;
          z-index: 3;
          background: white;
          padding: 0 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          border-radius: 6px;

          svg {
            margin-right: 2px;
            width: 20px;
            height: 20px;
          }

          span {
            font-size: 15px;
            color: var(--font-color-black);
            font-weight: 500;
            line-height: 17px;
            letter-spacing: 0;
            text-align: left;
          }
        }
      }

      .pe-bottom-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: calc(100% - 147px);
        padding: 9px 12px 15px 12px;
        transition: background-color 0.3s ease;

        p {
          line-height: 22px;
          font-size: 15px;
          color: var(--font-color-black);
          transition: color 0.3s ease;
        }

        a {
          line-height: 17px;
          font-size: 13px;
          color: var(--font-color-gray1);
          transition: color 0.3s ease;

          span,
          i {
            transition: color 0.3s ease;
          }
        }

        p:hover {
          color: var(--hover-blue);
        }

        a:hover,
        a:hover span,
        a:hover i {
          color: var(--hover-blue);
        }
      }

      .pe-bottom-box:hover {
        background-color: var(--bgc3);
      }
    }
  }
}
</style>