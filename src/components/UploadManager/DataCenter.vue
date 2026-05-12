<template>
    <div class="content">
        <div class="header flex-row-ac">
            <div class="header-nav flex-row">
                <div class="item" :style="curNav == 1 ? 'color: #00aeec;' : ''" @click="curNav = 1">数据概览<div
                        class="cursor" v-show="curNav == 1"></div>
                </div>
                <div class="item" :style="curNav == 2 ? 'color: #00aeec;' : ''" @click="curNav = 2">数据周报<div
                        class="cursor" v-show="curNav == 2"></div>
                </div>
                <div class="item" :style="curNav == 3 ? 'color: #00aeec;' : ''" @click="curNav = 3">稿件分析<div
                        class="cursor" v-show="curNav == 3"></div>
                </div>
            </div>
        </div>
        <div class="video-tab">
            <div class="core-data">
                <div class="title flex-row-ac jc-spb">
                    <div class="left flex-row-ac">
                        <span class="name">核心数据概览</span>
                    </div>
                    <div class="right flex-row-ac">
                        <div class="pop-menu-left">时间选择</div>
                        <el-dropdown trigger="click">
                            <div class="pop-menu-right flex-row-ac jcc">
                                <span>{{ titleConfig.dataRangeTag }}</span>
                                <svg class="c-icon" aria-hidden="true">
                                    <use xlink:href="#icon-bofangqi-bofang"></use>
                                </svg>
                            </div>
                            <template #dropdown>
                                <div class="be-dropdown-menu">
                                    <div class="be-dropdown-item" @click="onRangeChange(4, '近4天')"
                                        :style="titleConfig.dataRange == 2 ? 'color: #00aeec;' : ''">近4天</div>
                                    <div class="be-dropdown-item" @click="onRangeChange(7, '近7天')"
                                        :style="titleConfig.dataRange == 7 ? 'color: #00aeec;' : ''">近7天</div>
                                    <div class="be-dropdown-item" @click="onRangeChange(30, '近30天')"
                                        :style="titleConfig.dataRange == 30 ? 'color: #00aeec;' : ''">近30天</div>
                                    <div class="be-dropdown-item" @click="onRangeChange(90, '近90天')"
                                        :style="titleConfig.dataRange == 90 ? 'color: #00aeec;' : ''">近90天</div>
                                    <div class="be-dropdown-item" @click="onRangeChange(365, '历史累计')"
                                        :style="titleConfig.dataRange == 365 ? 'color: #00aeec;' : ''">历史累计</div>
                                </div>
                            </template>
                        </el-dropdown>
                        <span class="export">
                            <img src="../../assets/images/export-blue.png" alt="">
                            <span>导出数据</span>
                        </span>
                    </div>
                </div>
                <div class="info">
                    <div class="cell" v-for="(e, index) in cellItem" @click="onCellChange(index, e.tagName, e.fn)"
                        :style="curCell == index || hoverCell == index || hoverCell == index ? 'background-color:#f69;' : ''"
                        @mouseenter="hoverCell = index" @mouseleave="hoverCell = -1">
                        <svg class="c-icon cell-bg" aria-hidden="true" v-show="curCell == index || hoverCell == index">
                            <use :xlink:href="`#${e.icon}`"></use>
                        </svg>
                        <div class="top flex-row-ac jc-spb">
                            <div class="cell-title flex-row-ac">
                                <span :style="curCell == index || hoverCell == index ? 'color:#fff;' : ''">{{ e.tagName
                                }}</span>
                            </div>
                            <div class="cell-diff flex-row-ac" v-show="cellData[e.tagName].gap != 0">
                                <svg class="c-icon diff-icon" aria-hidden="true"
                                    :class="cellData[e.tagName].gap > 0 ? 'diff-num cell-di-up' : 'diff-num cell-di-down'"
                                    :style="curCell == index || hoverCell == index ? 'color:#fff;' : ''">
                                    <use xlink:href="#icon-bofang"></use>
                                </svg>
                                <span
                                    :class="cellData[e.tagName].gap > 0 ? 'diff-num cell-dn-up' : 'diff-num cell-dn-down'"
                                    :style="curCell == index || hoverCell == index ? 'color:#fff;' : ''">{{
                                        formatCount(Math.abs(cellData[e.tagName].gap))
                                    }}</span>
                            </div>
                        </div>
                        <div class="value" :style="curCell == index || hoverCell == index ? 'color:#fff;' : ''">{{
                            formatCount(cellData[e.tagName].total) }}</div>
                    </div>
                </div>
                <div class="chart">
                    <div class="chart-header flex-row-ac">
                        <span class="charts-title">{{ titleConfig.dataRangeTag + ct }}</span>
                        <div class="legends flex-row-ac" v-show="curCell == 0">
                            <div class="self legends flex-row-ac">总播放量</div>
                            <div class="fans legends flex-row-ac">粉丝播放量</div>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div ref="canvas" class="canvas"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { CellItem } from '@/api/UploadManager/index'
import { options } from '@/api/UploadManager/echartsOptions'
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/util/userStore';
import { getTotalPlay, getLike } from '@/api/UploadManager/dataCenter/index'
import { geneDateList, formatCount } from '@/util';
import { DataResVo } from '@/api/UploadManager/dataCenter/types';
const userStore = useUserStore()
const curNav = ref<number>(1);
//时间范围选择
const titleConfig = reactive({
    dataRangeTag: "近4天",
    dataRange: 4,
    pop: false
})
function onRangeChange(id: number, tag: string) {
    titleConfig.dataRange = id;
    titleConfig.dataRangeTag = tag;
    //生成横轴日期列表
    xData.value = geneDateList(titleConfig.dataRange)
    resetData()
}
//cellItem
const curCell = ref<number>(0);
const ct = ref<string>('播放量')
const hoverCell = ref<number>(-1);
const cellItem = ref<CellItem[]>([
    { tagName: '播放量', icon: 'icon-bofangqi-bofangxiaodianshi', fn: onGetTotalPlay },
    { tagName: '空间访客', icon: 'icon-bofangqi-zantingxiaodianshi', fn: wait },
    { tagName: '净增粉丝', icon: 'icon-fensi', fn: wait },
    { tagName: '点赞', icon: 'icon-dianzan_kuai', fn: onGetLike },
    { tagName: '收藏', icon: 'icon-shoucangtianchong', fn: wait },
    { tagName: '硬币', icon: 'icon-toubix', fn: wait },
    { tagName: '评论', icon: 'icon-jiaoliuxuanzhong', fn: wait },
    { tagName: '弹幕', icon: 'icon-danmushu', fn: wait },
    { tagName: '分享', icon: 'icon-fenxiang1', fn: wait },
    { tagName: '充电', icon: 'icon-BMLdingdan', fn: wait }
])
const cellData = reactive({
    '播放量': { mainRes: [], subRes: [], gap: 0, total: 0 },
    '空间访客': { mainRes: [], gap: 0, total: 0 },
    '净增粉丝': { mainRes: [], gap: 0, total: 0 },
    '点赞': { mainRes: [], gap: 0, total: 0 },
    '收藏': { mainRes: [], gap: 0, total: 0 },
    '硬币': { mainRes: [], gap: 0, total: 0 },
    '评论': { mainRes: [], gap: 0, total: 0 },
    '弹幕': { mainRes: [], gap: 0, total: 0 },
    '分享': { mainRes: [], gap: 0, total: 0 },
    '充电': { mainRes: [], gap: 0, total: 0 }
})
function resetData() {//重置全部数据
    onGetLike()
    onGetTotalPlay()
}
function calData(tagName: string, data: DataResVo, hasSubData: boolean) {
    cellData[tagName].mainRes = data.mainRes;//本周期主数据
    if (hasSubData) cellData[tagName].subRes = data.subRes;//本周期副数据，如果有的话
    let total1 = 0;//本周期总和
    let total2 = 0;//上周期总和
    data.mainRes.forEach(e => { total1 += e; });//累加本周期
    data.lastMainRes.forEach(e => { total2 += e; });//累加上周期
    cellData[tagName].total = total1;
    cellData[tagName].gap = total1 - total2;
}
async function onGetTotalPlay() {
    try {
        const { data } = await getTotalPlay(userStore.userInfo.uid, xData.value[0], xData.value[xData.value.length - 1]);
        console.log('获取播放量数据：', data)
        calData('播放量', data, true);
        if (ct.value == '播放量') resetOption();
    } catch (error) {
        console.log(error);
        ElMessage.warning('获取总播放量失败！');
    }
}
async function onGetLike() {
    try {
        const { data } = await getLike(userStore.userInfo.uid, xData.value[0], xData.value[xData.value.length - 1]);
        console.log('获取点赞数据：', data);
        calData('点赞', data, false);
        if (ct.value == '点赞') resetOption();
    } catch (error) {
        console.log(error);
        ElMessage.warning('获取总点赞失败！');
    }
}
async function wait() {
    ElMessage.warning('尚待建设！')
}
//echarts
const xData = ref<string[]>([])
function onCellChange(id: number, tag: string, fn: () => void) {
    if (tag == ct.value) return;
    curCell.value = id
    ct.value = tag
    if (cellData[ct.value].mainRes.length == 0) fn();
    resetOption();
}
const canvas = ref<HTMLDivElement | null>(null);
var myChart: echarts.ECharts | null = null;
function resetOption() {
    if (myChart == null) {
        ElMessage.warning('echarts实例为空！')
        return;
    }
    let option = options[ct.value]
    if (ct.value == '播放量') {
        option.xAxis['data'] = xData.value
        option.series[0]['data'] = cellData[ct.value].mainRes
        option.series[1]['data'] = cellData[ct.value].subRes
    } else {
        option.xAxis['data'] = xData.value
        option.series[0]['data'] = cellData[ct.value].mainRes
    }
    myChart.setOption(option, true)
}
onMounted(() => {
    if (canvas.value) {
        myChart = echarts.init(canvas.value);
        window.addEventListener('resize', () => { myChart.resize(); });
    }
    //初始选择时间范围为4天内
    onRangeChange(4, '近4天');
});
</script>
<style scoped lang="less">
.cell-ac {
    background-color: #f69;
}

.cell-di-down {
    transform: rotate(90deg);
    color: #2ac864;
}

.cell-di-up {
    transform: rotate(-90deg);
    color: #f69;
}

.cell-dn-down {
    color: #2ac864;
}

.cell-dn-up {
    color: #f69;
}

.pop-menu-right {
    padding: 5px 12px;
    margin-left: 12px;
    border: 1px solid #c9ccd0;
    border-radius: 6px;
    cursor: pointer;

    span {
        font-size: 13px;
        white-space: nowrap;
        font-weight: 700;
        color: #000;
    }

    svg {
        transform: rotate(90deg);
        margin-left: 4px;
        width: 12px;
        height: 12px;
    }
}

.content {
    width: 1040px;
    margin: 0 auto;

    .header {
        .header-nav {
            margin: 0 0 40px;
            padding-top: 32px;

            .item {
                position: relative;
                font-weight: 500;
                font-size: 18px;
                line-height: 25px;
                cursor: pointer;

                .cursor {
                    position: absolute;
                    bottom: -7px;
                    height: 4px;
                    width: 24px;
                    background-color: var(--hover-blue);
                    border-radius: 2px;
                    margin: 0 24px;
                }
            }

            .item:nth-child(n+2) {
                margin-left: 40px;
            }

            .item:hover {
                color: var(--hover-blue);
            }
        }
    }

    .video-tab {
        padding-bottom: 56px;

        .core-data {
            background-color: #fff;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;

            .title {
                .left {
                    .name {
                        margin-right: 4px;
                        color: #18191c;
                        font-weight: 600;
                        font-size: 18px;
                        line-height: 25px;
                    }
                }

                .right {
                    .pop-menu-left {
                        font-size: 13px;
                        color: #61666d;
                        padding: 0 13px;
                        border-width: 0;
                        border-right-width: 1px;
                        border-color: #c9ccd0;
                        border-style: solid;
                    }

                    .export {
                        display: inline-block;
                        width: 94px;
                        height: 32px;
                        margin-left: 16px;
                        padding: 6px 10px;
                        line-height: 20px;
                        cursor: pointer;
                        border-radius: 6px;

                        img {
                            width: 16px;
                            height: 16px;
                            vertical-align: -3px;
                        }

                        span {
                            font-size: 13px;
                            color: #00aeec;
                            margin-left: 6px;
                            font-weight: 500;
                        }
                    }

                    .export:hover {
                        background-color: #dbf5ff;
                    }
                }
            }

            .info {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                gap: 15px;
                margin: 24px 0 15px 0;

                .cell {
                    position: relative;
                    display: inline-block;
                    width: 186px;
                    height: 80px;
                    padding: 12px 16px 16px 16px;
                    background-color: #fafafa;
                    cursor: pointer;
                    border-radius: 12px;
                    white-space: nowrap;
                    overflow: hidden;

                    .cell-bg {
                        position: absolute;
                        color: #fff;
                        width: 100px;
                        height: 80px;
                        right: -10px;
                        top: -10px;
                        transform: rotate(-20deg);
                        opacity: 0.4;
                        z-index: 1;
                    }

                    .top {
                        .cell-title {
                            line-height: 20px;

                            span {
                                color: #666;
                                font-size: 14px;
                                font-weight: 700;
                            }
                        }

                        .cell-diff {
                            z-index: 2;

                            .diff-icon {
                                width: 7px;
                                height: 7px;
                                fill: currentColor;
                                vertical-align: -.15em;
                                overflow: hidden;
                            }

                            .diff-num {
                                margin-left: 4px;
                                font-size: 15px;
                                font-weight: 700;
                            }
                        }
                    }

                    .value {
                        color: #000;
                        line-height: 24px;
                        font-size: 18px;
                        font-weight: 700;
                    }
                }

                .cell:hover {
                    background-color: #f69;
                }

                .cell:hover .cell-title span,
                .cell:hover .value,
                .cell:hover .diff-num {
                    color: #fff;
                }
            }

            .chart {
                margin-top: 8px;
                padding: 24px 24px 36px 24px;
                border: 1px solid #f1f2f3;
                border-radius: 12px;

                .chart-header {
                    height: 22px;
                    line-height: 22px;

                    .charts-title {
                        color: #18191c;
                        font-weight: 600;
                        font-size: 16px;
                    }

                    .legends {
                        margin-left: 40px;

                        .legends {
                            color: var(--font-color-black);
                            font-size: 14px;
                            font-weight: 400;
                        }

                        .legends::before {
                            content: " ";
                            display: inline-block;
                            width: 16px;
                            height: 4px;
                            border-radius: 2px;
                            margin-right: 10px;
                        }

                        .self::before {
                            background-color: #ff4684;
                        }

                        .fans::before {
                            background-color: #00aeec;
                        }
                    }
                }

                .wrapper {
                    position: relative;

                    .canvas {
                        width: 953px;
                        height: 300px;
                    }
                }
            }
        }
    }
}
</style>