export interface ChatUser {
  id: string;
  name: string;
  image?: string;
}

export interface ChatConfig {
  apiKey: string;
  userId: string;
  userToken: string;
  channelId: string;
}
