export interface SendChatMessageInputDTO {
  publicationId: string;
  senderId: string;
  content: string;
}

export interface ListChatMessagesInputDTO {
  publicationId: string;
  requesterId: string;
  limit?: number;
}

export interface ChatMessageOutputDTO {
  id: string;
  publicationId: string;
  senderId: string;
  senderAlias?: string;
  content: string;
  createdAt: string;
}
