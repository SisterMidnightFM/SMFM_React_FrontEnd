import { createLazyFileRoute } from '@tanstack/react-router';
import { ChatroomPage } from '../components/chatroom/ChatroomPage';

export const Route = createLazyFileRoute('/chatroom')({
  component: ChatroomPage,
});
