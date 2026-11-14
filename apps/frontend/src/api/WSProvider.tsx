import { authClient } from '@/utils/auth-client';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WSContext = createContext<SocketService | undefined>(undefined);

type SocketService = {
  emit: (event: string, data: {}) => void;
  on: (event: string, cb: any) => void;
  off: (event: string) => void;
  connect: () => void;
  disconnect: () => void;
};
type Props = { children: ReactNode };
export const WSProvider = ({ children }: Props) => {
  const { data: userSession } = authClient.useSession();
  const [socketAccessToken, setSocketAccessToken] = useState('');
  const socket = useRef<Socket>(undefined);
  const refresh = useRef<boolean>(false);

  useEffect(() => {
    if (userSession) {
      const token = userSession.session.token;
      setSocketAccessToken(token);
    }
  }, [userSession]);

  useEffect(() => {
    if (socketAccessToken) {
      if (socket.current) {
        socket.current.disconnect();
      }
      socket.current = io(`http://${process.env.EXPO_PUBLIC_API_URL}/`, {
        transports: ['websocket'],
        withCredentials: true,
        extraHeaders: {
          Authorization: `Bearer ${socketAccessToken}`,
        },
      });
      socket.current.on('connect_error', (error) => {
        if (error.message === 'Authentication error') {
          console.log('Auth connection error: ', error.message);
        }
      });
      refresh.current = false;
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [socketAccessToken, refresh]);

  const emit = (event: string, data = {}) => {
    socket.current?.emit(event, data);
  };

  const on = (event: string, cb: () => any) => {
    socket.current?.on(event, cb);
  };

  const off = (event: string) => {
    socket.current?.off(event);
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = undefined;
    }
  };
  const connect = () => {
    refresh.current = true;
  };

  const socketService = {
    emit,
    on,
    off,
    connect,
    disconnect,
  };
  return <WSContext.Provider value={socketService}>{children}</WSContext.Provider>;
};

export const useWS = () => {
  const socketService = useContext(WSContext);
  if (!socketService) {
    throw new Error('useWS must be used within a WSProvider');
  }
  return socketService;
};
