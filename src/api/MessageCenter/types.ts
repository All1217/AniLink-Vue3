import { Query } from "../Models"
// 系统通知
export interface Notice {
    id: number
    text: string
    sText?: any
    time: string
    title: string
    isHtml: boolean
}
export interface Chat {
    id: number
    targetId: number
    senderId: number
    latestTime: string
}
export interface ChatVo extends Chat {
    senderName: string
    targetName: string
    senderAvatar: string
    targetAvatar: string
    chatMessage: ChatMessage//最近一条消息
    unreadCount: number
}
export interface ChatMessage {
    id: number
    targetId: number
    senderId: number
    content: string
    senderDel: number
    targetDel: number
    withdraw: number
    messageType: number
    time: string
    readStatus: number
}
export interface ChatQueryVo extends Query {
    id?: number
    time?: string
    uid?: number
    senderId?: number
    targetId?: number
}
export interface ChatMessageDTO {
    from: number
    to: number
    type: string
    content?: string
    token?: string
}