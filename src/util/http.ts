import axios from 'axios'
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from './userStore'
import { ResultEnum } from '@/api/enums'
import { ResultData } from '@/api/Models'
import { LOGIN_URL } from '@/util/config'
import { RESEETSTORE } from './userStore'
import { CookieUtil } from '@/util/cookie'
import router from '@/router'

export const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: ResultEnum.TIMEOUT as number,
})
/**
 * @description: 导出封装的请求方法
 * @returns {*}
 */
const http = {
  get<T>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.get(url, { params, ...config })
  },

  post<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.post(url, data, config)
  },

  put<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.put(url, data, config)
  },

  delete<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.delete(url, { data, ...config })
  },
}

let canRefresh = true
async function refreshToken(data: any) {
  if (!canRefresh) return;
  canRefresh = false;
  try {
    const res = await http.get<string>('/main/public/refresh');
    const userStore = useUserStore();
    userStore.token = '' + res;
    router.push(LOGIN_URL)
    return Promise.reject(data);
  } catch (error) {
    ElMessage.error('登录失效，请重新登录！')
    RESEETSTORE();
    router.push(LOGIN_URL)
    return Promise.reject(data);
  }
}

/**
 * @description: 请求拦截器
 * @returns {*}
 */
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers['access-token'] = token
    }
    const r = userStore.refreshToken;
    if (r != null && r != '') {
      CookieUtil.set('refresh-token', r);
    }
    //无法直接设置，因为不安全会被阻止
    // config.headers['origin'] = window.location.origin
    return config
  },
  (error: AxiosError) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)
/**
 * @description: 响应拦截器
 * @returns {*}
 * TODO: 通过header获取refresh-token并放入cookie，这是权宜之举，生产环境有安全隐患
 */
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { data } = response
    const r = response.headers['refresh-token'];
    if (r != null && r != '') {
      const userStore = useUserStore();
      userStore.setRefreshToken(r);
      CookieUtil.set('refresh-token', r);
    }
    if (ResultEnum.EXPIRE.includes(data.code)) {
      // ElMessage.error('登录失效，请重新登录！')
      // RESEETSTORE();
      // router.push(LOGIN_URL)
      // return Promise.reject(data)
      return refreshToken(data)
    }
    if (data.code && data.code !== ResultEnum.SUCCESS) {
      ElMessage.error(data.message || ResultEnum.ERRMESSAGE)
      return Promise.reject(data)
    }
    return data
  },
  async (error: AxiosError) => {
    // HTTP 状态码
    const status = error.response?.status
    if (status == 305 || status == 601 || status == 602) {
      refreshToken(error);
      return Promise.reject(error);
    }
    return Promise.reject(error)
  },
)
export default http