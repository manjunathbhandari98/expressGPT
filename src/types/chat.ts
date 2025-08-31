// types/chat.ts
import type { Message } from './message';

export type Chat = {
  id: string; // Changed from number to string for consistency
  title: string;
  messages: Message[];
  createdAt: Date;
};
