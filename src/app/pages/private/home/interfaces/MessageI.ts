export interface MessageI{
    content: string
    time: string
    isRead: boolean
    owner?: string
    isMe: boolean
    chatUid:string,
    enviadoPor:string
}
