import { StreamChat } from 'stream-chat';
import type { Channel } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const GUEST_ID_KEY = 'smfm_chat_guest_id';
const GUEST_TOKEN_KEY = 'smfm_chat_guest_token';
const USERNAME_KEY = 'smfm_chat_username';

let clientInstance: StreamChat | null = null;
let connectionPromise: Promise<StreamChat> | null = null;

interface GuestUser {
  id: string;
  token: string;
}

function getOrCreateGuestId(): string {
  // Try to get existing guest ID from localStorage
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  // Check if this is an old-style guest ID (short format without token)
  // If so, clear it and generate a new one
  if (guestId && !localStorage.getItem(GUEST_TOKEN_KEY) && guestId.startsWith('guest-') && guestId.length < 20) {
    localStorage.removeItem(GUEST_ID_KEY);
    guestId = null;
  }

  if (!guestId) {
    // Generate a new random guest user ID
    guestId = `guest-${Math.random().toString(36).substring(2, 11)}`;
    // Don't store it yet - we'll store the full ID from Stream after connection
  }

  return guestId;
}

function getStoredGuestUser(): GuestUser | null {
  const id = localStorage.getItem(GUEST_ID_KEY);
  const token = localStorage.getItem(GUEST_TOKEN_KEY);

  if (id && token) {
    return { id, token };
  }

  return null;
}

function storeGuestUser(id: string, token: string): void {
  localStorage.setItem(GUEST_ID_KEY, id);
  localStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export async function updateUsername(username: string): Promise<void> {
  localStorage.setItem(USERNAME_KEY, username);

  // If we have a connected client, update the user's name
  if (clientInstance?.userID) {
    await clientInstance.partialUpdateUser({
      id: clientInstance.userID,
      set: {
        name: username || 'Anonymous',
      },
    });
  }
}

function getDisplayName(): string {
  const username = getUsername();
  return username || 'Anonymous';
}

export async function initializeChatClient() {
  if (!STREAM_API_KEY) {
    throw new Error('Stream API key is not configured');
  }

  // If we're already connecting, return the existing promise
  if (connectionPromise) {
    return connectionPromise;
  }

  // If we already have a connected client, return it
  if (clientInstance?.userID) {
    return clientInstance;
  }

  // Create new connection promise
  connectionPromise = (async () => {
    try {
      const client = StreamChat.getInstance(STREAM_API_KEY);
      const storedUser = getStoredGuestUser();
      const displayName = getDisplayName();

      // Try to reconnect with stored credentials first
      if (storedUser) {
        try {
          // Check if already connected as this user
          if (client.userID === storedUser.id) {
            clientInstance = client;
            connectionPromise = null;
            return client;
          }

          // Disconnect if connected as different user
          if (client.userID) {
            await client.disconnectUser();
          }

          // Reconnect with stored token
          await client.connectUser(
            {
              id: storedUser.id,
              name: displayName,
            },
            storedUser.token
          );

          clientInstance = client;
          connectionPromise = null;
          return client;
        } catch (error) {
          // If reconnection fails, clear stored credentials and create new guest
          console.warn('Failed to reconnect with stored credentials, creating new guest user');
          localStorage.removeItem(GUEST_ID_KEY);
          localStorage.removeItem(GUEST_TOKEN_KEY);
        }
      }

      // Disconnect if connected as different user
      if (client.userID) {
        await client.disconnectUser();
      }

      // Create new guest user
      const guestId = getOrCreateGuestId();

      // Connect as new guest user with display name
      const response = await client.setGuestUser({
        id: guestId,
        name: displayName,
      });

      // Store the user ID and token for future sessions
      if (response.me && client.tokenManager.token) {
        storeGuestUser(response.me.id, client.tokenManager.token);
      }

      // Wait for connection to be ready
      if (!client.userID) {
        throw new Error('Failed to establish connection');
      }

      clientInstance = client;
      connectionPromise = null;
      return client;
    } catch (error) {
      // Clear the promise on error so we can retry
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

export async function getOrCreateChannel(
  client: StreamChat,
  channelId: string
): Promise<Channel> {
  // Verify client is connected
  if (!client.userID) {
    throw new Error('Client must be connected before creating a channel');
  }

  // Join existing channel (don't create)
  const channel = client.channel('livestream', channelId);

  await channel.watch();

  return channel;
}

export async function disconnectChat(client: StreamChat | null) {
  if (client && client.userID) {
    await client.disconnectUser();
    clientInstance = null;
    connectionPromise = null;
  }
}
