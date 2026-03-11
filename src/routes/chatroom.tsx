import { createFileRoute } from '@tanstack/react-router';
import { ChatroomPage } from '../components/chatroom/ChatroomPage';

export const Route = createFileRoute('/chatroom')({
  pendingComponent: () => null,
  component: ChatroomPage,
});
