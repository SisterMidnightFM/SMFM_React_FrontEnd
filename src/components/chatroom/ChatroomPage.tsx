import { useState, useEffect } from 'react';
import { PageHeader } from '../shared/PageHeader';
import type { StreamChat } from 'stream-chat';
import type { Channel } from 'stream-chat';
import { Chat, Channel as ChannelComponent, Window, MessageList, MessageInput, Thread } from 'stream-chat-react';
import { initializeChatClient, getOrCreateChannel, disconnectChat } from '../../services/chat';
import { UsernameSettings } from './UsernameSettings';
import './ChatroomPage.css';
import 'stream-chat-react/dist/css/v2/index.css';
import './ChatroomTheme.css';

export function ChatroomPage() {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let chatClient: StreamChat | null = null;

    const initChat = async () => {
      try {
        // Connect as guest user for public chatroom
        chatClient = await initializeChatClient();

        if (!isMounted) {
          // Component unmounted during init, just return
          return;
        }

        const chatChannel = await getOrCreateChannel(chatClient, 'MainChat');

        if (!isMounted) {
          // Component unmounted during channel creation, just return
          return;
        }

        setClient(chatClient);
        setChannel(chatChannel);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing chat:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load chatroom');
          setIsLoading(false);
        }
      }
    };

    initChat();

    return () => {
      isMounted = false;
      // Don't disconnect here - the singleton client may be reused
      // Disconnect will happen on window unload or when truly leaving the app
    };
  }, []);

  // Disconnect on window unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (client) {
        disconnectChat(client);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [client]);

  if (isLoading) {
    return (
      <div className="chatroom-page">
        <div className="chatroom-page__loading">Loading chatroom...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chatroom-page">
        <PageHeader
          title="CHATROOM"
          iconSrc="/Images/Star1_Dark.webp"
        />
        <div className="chatroom-page__error">
          <p>Error loading chatroom: {error}</p>
          <p className="chatroom-page__error-hint">
            Make sure you have configured your Stream.io API key in the .env file
          </p>
        </div>
      </div>
    );
  }

  if (!client || !channel) {
    return (
      <div className="chatroom-page">
        <div className="chatroom-page__error">Unable to connect to chat</div>
      </div>
    );
  }

  return (
    <div className="chatroom-page">
      <PageHeader
        title="CHATROOM"
        iconSrc="/Images/Star1_Dark.webp"
      />

      <div className="chatroom-page__content">
        <UsernameSettings />
        <Chat client={client}>
          <ChannelComponent channel={channel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </ChannelComponent>
        </Chat>
      </div>
    </div>
  );
}
