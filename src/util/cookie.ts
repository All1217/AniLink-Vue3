/**
 * Cookie 操作工具类
 */
export class CookieUtil {
  /**
   * 设置 Cookie
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param days 过期天数（默认7天）
   * @param path 路径（默认根路径）
   */
  static set(name: string, value: string, days: number = 7, path: string = '/'): void {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}`
  }

  /**
   * 获取 Cookie
   * @param name Cookie 名称
   * @returns Cookie 值，不存在则返回 null
   */
  static get(name: string): string | null {
    const cookieArr = document.cookie.split('; ')
    
    for (const cookie of cookieArr) {
      const [cookieName, cookieValue] = cookie.split('=')
      if (cookieName === name) {
        return decodeURIComponent(cookieValue)
      }
    }
    
    return null
  }

  /**
   * 删除 Cookie
   * @param name Cookie 名称
   * @param path 路径（默认根路径）
   */
  static remove(name: string, path: string = '/'): void {
    this.set(name, '', -1, path)
  }

  /**
   * 检查 Cookie 是否存在
   * @param name Cookie 名称
   */
  static has(name: string): boolean {
    return this.get(name) !== null
  }

  /**
   * 获取所有 Cookie
   * @returns 所有 Cookie 的键值对对象
   */
  static getAll(): Record<string, string> {
    const cookies: Record<string, string> = {}
    const cookieArr = document.cookie.split('; ')
    
    for (const cookie of cookieArr) {
      const [name, value] = cookie.split('=')
      if (name) {
        cookies[name] = decodeURIComponent(value)
      }
    }
    
    return cookies
  }

  /**
   * 清空所有 Cookie
   * @param path 路径（默认根路径）
   */
  static clear(path: string = '/'): void {
    const cookies = this.getAll()
    Object.keys(cookies).forEach(name => {
      this.remove(name, path)
    })
  }
}