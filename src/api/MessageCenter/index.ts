import http from "@/util/http";
import { PageRes } from "../Models";
import { Chat, ChatMessage, ChatQueryVo, ChatVo } from "./types";


/**
 * @description 获取聊天对象列表
 */
export function getChatVoList(query: ChatQueryVo){
    return http.get<PageRes<ChatVo>>('/main/chat/getChatVoPage', query)
}
/**
 * @description 删除聊天对象
 */
export function deleteChat(query: ChatQueryVo){
    return http.delete('/main/chat/deleteChat', query)
}
/**
 * @description 获取聊天对象列表
 */
export function getChatMessage(query: ChatQueryVo){
    return http.get<PageRes<ChatMessage>>('/main/chat/getChatMessagePage', query)
}
/**
 * @description 生成聊天对象
 */
export function geneChat(query: Chat){
    return http.post<ChatVo>('/main/chat/insertOneChat', query)
}
/**
 * @description 插入新消息
 */
export function insertChatMessage(query: ChatMessage){
    return http.post('/main/chat/insertOneChatMessage', query)
}
/**
 * @description 更新最近打开时间
 */
export function updateOpenTime(query: ChatQueryVo){
    return http.put('/main/chat/update', query)
}
/**
 * @description 批量更新未读消息
 */
export function updateUnread(query: ChatQueryVo){
    return http.put('/main/chat/update/unread', query)
}