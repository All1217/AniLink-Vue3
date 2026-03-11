import { DateStringType } from "@/api/enums"

//修改DOM元素style
export function changeStyle(element: any, map: Map<string, string>) {
    const keys = map.keys();
    for (const key of keys) {
        element.style[key] = map.get(key);
    }
}

export function openNewPage(url: string, isBlank: boolean) {
    if (isBlank) {
        window.open(url, '_blank');
    } else {
        window.open(url);
    }
}

//获取元素的translateX偏移量
export function getTranslateX(element: HTMLElement) {
    // 获取元素的计算样式
    const style = window.getComputedStyle(element);
    // 获取 transform 属性
    const transform = style.transform;
    if (transform && transform !== 'none') {
        // 解析 matrix 或者 matrix3d 格式
        const matrix = transform.match(/^matrix(3d)?\((.+)\)$/);
        if (matrix) {
            // 如果是 3d 向量，则 translateX 在第13个位置，否则在第5个位置
            const is3D = matrix[1] === '3d';
            const values = matrix[2].split(', ');
            const translateX = parseFloat(is3D ? values[12] : values[4]);
            return translateX;
        }
    }
    // 默认情况下，返回 0
    return 0;
}

//获取像素比和放大比例
export function getPixelRatio(context: any) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
};

/**
 * @description: 时间相关 
 */
export function sliceDateTime(dateTime: string): string {
    if (dateTime.length == 0) {
        return dateTime;
    }
    return dateTime.split(' ')[0]
}
export function formatStringDate(input: string, type: DateStringType): string {
    const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = input.match(regex);
    if (match) {
        const year = match[1];
        const month = match[2];
        const day = match[3];
        const hour = match[4];
        const minute = match[5];
        const second = match[6];

        switch (type) {
            case DateStringType.MON_D_H_MIN:
                return `${month}-${day} ${hour}:${minute}`;
            case DateStringType.M_D:
                return `${month}-${day}`;
            case DateStringType.Y_M_D:
                return `${year}-${month}-${day}`
            case DateStringType.ALL:
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`
            default:
                return `${month}-${day} ${hour}:${minute}`
        }
    } else {
        return ''
        // throw new Error("Invalid date format. Please use yyyy-MM-dd HH:mm:ss format.");
    }
}
//计算两个字符串代表的时间差是否符合条件
export function timeGap(time1: string, time2: string, condition: number): boolean {
    // 将传入的日期时间字符串转为 Date 对象
    const date1 = new Date(time1.replace(/-/g, '/')); // 将 '-' 替换为 '/' 以兼容 Date 构造函数
    const date2 = new Date(time2.replace(/-/g, '/'));
    // 计算时间差，结果单位为毫秒
    const res = Math.abs(date2.getTime() - date1.getTime());
    // 将条件时间从秒转换为毫秒并与差值比较
    return res > condition * 1000;
}
//生成格式化date字符串列表
export function geneDateList(daysBack: number): string[] {
    const dateList: string[] = [];
    // 获取今天的日期
    const today = new Date();
    for (let i = 0; i < daysBack; i++) {
        // 复制今天的日期，避免修改原始日期
        const date = new Date(today);
        // 在今天的基础上减去 i 天
        date.setDate(today.getDate() - i);
        // 格式化日期为 yyyy-MM-dd 格式
        const formattedDate = date.toISOString().split('T')[0];
        // 将格式化后的日期添加到列表中
        dateList.push(formattedDate);
    }
    return dateList;
}
//获取时间字符串
export function getFormatCurTime(timeStamp: number, type: DateStringType): string {
    const date = new Date(timeStamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    switch (type) {
        case DateStringType.Y_M_D:
            return `${year}-${month}-${day}`
        case DateStringType.MON_D_H_MIN:
            return `${month}-${day} ${hours}:${minutes}`
        case DateStringType.M_D:
            return `${month}-${day}`
        default:
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
}
//格式化视频时长
export function formatTimeGap(seconds: number): string {
    if (seconds < 0 || isNaN(seconds)) {
        throw new Error('Invalid input: seconds must be a non-negative number.');
    }
    const totalSeconds = Math.floor(seconds);
    // 计算分钟和秒钟
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    // 格式化为 mm:ss，确保分钟和秒钟都为两位数
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
//根据时间字符串得知所属时间区段
export function classifyDate(dateStr: string): number {
    // 1. 解析时间字符串为 Date 对象（注意：兼容“yyyy-MM-dd HH:mm:ss”）
    const dateTime = dateStr.replace(/-/g, '/'); // 兼容 Safari
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return 5;
    // 2. 获取今天、昨天、7天前的起止时间
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);

    const weekAgoStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    // 3. 分类判断
    if (date >= todayStart && date <= todayEnd) {
        return 1;
    } else if (date >= yesterdayStart && date <= yesterdayEnd) {
        return 2;
    } else if (date >= weekAgoStart && date < yesterdayStart) {
        return 3;
    } else if (date < weekAgoStart) {
        return 4;
    } else {
        return 5; // 不属于任何区间（理论不会走到这一步）
    }
}
//生成四个时间区段的起始时间字符串
function format(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
type TimeRange = {
    startDate: string | null,
    endDate: string
};
export function getTimeRanges(type: number, now?: Date): TimeRange {
    // 支持传入now参数，方便测试
    const base = now ? new Date(now) : new Date();
    // 今天
    const todayStart = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0);
    const todayEnd = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59);
    // 昨天
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);
    // 近一周（不包括昨天/今天）
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(yesterdayStart.getTime() - 1); // 昨天的前一秒（即昨天的23:59:59）
    // 一周之前
    // 起点不限，结束时间为 weekStart 的前一秒
    const beforeWeekEnd = new Date(weekStart.getTime() - 1);
    if (type == 1) {
        return {
            startDate: format(todayStart),
            endDate: format(todayEnd)
        }
    } else if (type == 2) {
        return {
            startDate: format(yesterdayStart),
            endDate: format(yesterdayEnd)
        }
    } else if (type == 3) {
        return {
            startDate: format(weekStart),
            endDate: format(weekEnd)
        }
    } else if (type == 4) {
        return {
            startDate: null,
            endDate: format(beforeWeekEnd)
        }
    } else {
        return { startDate: null, endDate: null }
    }
}

//登录账号校验
export function validateAccount(str: string): boolean {
    return str.length <= 15 && /^[0-9]+$/.test(str);
}
//密码校验
export function validatePass(str: string): boolean {
    // 检查字符串长度是否大于等于6，且仅包含大写/小写字母、数字和特定字符
    const regex = /^[A-Za-z0-9,.?!]+$/;
    return str.length >= 6 && regex.test(str);
}
export function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const videoElement = document.createElement('video');
        const fileURL = URL.createObjectURL(file);

        videoElement.src = fileURL;
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
            // 获取视频时长
            const duration = videoElement.duration;
            // 释放对象URL
            URL.revokeObjectURL(fileURL);
            resolve(duration);
        };

        videoElement.onerror = () => {
            URL.revokeObjectURL(fileURL);
            reject(new Error('无法加载视频文件'));
        };
    });
}
//格式化数据
export function formatCount(count: number): string {
    if (count < 0 || isNaN(count)) {
        throw new Error('@/util/index.ts: Invalid input: play count must be a non-negative number.');
    }
    if (count < 10000) {
        return count.toString();
    } else if (count < 100_000_000) {
        const countInWan = count / 10_000;
        return `${countInWan.toFixed(1)}万`;
    } else {
        const countInYi = Math.floor(count / 100_000_000);
        return `${countInYi}亿`;
    }
}
//从route获取id
export function geneId(param: string | string[]): number {
    return parseInt(param.toString())
}
//从数组中删除满足某条件的元素，最多删除一个
export function removeOneElement<T>(arr: T[], condition: (element: T) => boolean): T[] {
    // 使用 find 方法查找第一个满足条件的元素
    const index = arr.findIndex(condition);
    // 如果找到了满足条件的元素，使用 splice 删除该元素
    if (index !== -1) arr.splice(index, 1);
    return arr;
}