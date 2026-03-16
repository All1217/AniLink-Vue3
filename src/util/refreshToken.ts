import { refreshToken } from "@/api/app";
import router from '@/router'
import { LOGIN_URL } from '@/util/config'
import { RESEETSTORE } from './userStore'
import { useUserStore } from './userStore'
import { ElMessage } from 'element-plus'

let canRefresh = true //防止短时间内频繁发出大量请求导致卡顿或出错
export async function doRefreshToken(data: any) {
    if (!canRefresh) return;
    canRefresh = false;
    try {
        const res = await refreshToken();
        ElMessage.success(res)
        // ElMessage.success(res.data)
        if (res.code == 200) {
            const userStore = useUserStore();
            userStore.token = res.data;
        } else {
            ElMessage.error('登录失效，请重新登录！')
            RESEETSTORE();
        }
        canRefresh = true;
        router.push(LOGIN_URL)
        return Promise.reject(data);
    } catch (error) {
        ElMessage.error('登录失效，请重新登录！')
        RESEETSTORE();
        canRefresh = true;
        router.push(LOGIN_URL)
        return Promise.reject(data);
    }
}