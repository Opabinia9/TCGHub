import { authClient } from '@/utils/auth-client';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WSContext = createContext<SocketService | undefined>(undefined);

type SocketService = {
  socket: Socket | undefined;
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
  const [socket, setSocket] = useState<Socket>();
  const refresh = useRef<boolean>(false);

  useEffect(() => {
    if (userSession) {
      const token = userSession.session.token;
      setSocketAccessToken(token);
    }
  }, [userSession]);

  useEffect(() => {
    if (socketAccessToken) {
      if (socket) {
        socket.disconnect();
      }
      setSocket(
        io(`http://${process.env.EXPO_PUBLIC_API_URL}/`, {
          transports: ['websocket'],
          withCredentials: true,
          extraHeaders: {
            Authorization: `Bearer ${socketAccessToken}`,
          },
        }),
      );

      socket?.on('connect_error', (error) => {
        if (error.message === 'Authentication error') {
          console.log('Auth connection error: ', error.message);
        }
      });
      refresh.current = false;
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [socketAccessToken, refresh]);

  const emit = (event: string, data = {}) => {
    socket?.emit(event, data);
  };

  const on = (event: string, cb: () => any) => {
    socket?.on(event, cb);
  };

  const off = (event: string) => {
    socket?.off(event);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(undefined);
    }
  };
  const connect = () => {
    refresh.current = true;
  };

  const socketService = {
    socket,
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
