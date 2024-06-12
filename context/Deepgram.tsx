"use client";

import {
  CreateProjectKeyResponse,
  LiveClient,
  LiveSchema,
  LiveTranscriptionEvents,
  SpeakSchema,
} from "@deepgram/sdk";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// import { useToast } from "./Toast";
import { toast } from "sonner";

type DeepgramContext = {
  connection: LiveClient | undefined;
  connectionReady: boolean;
};

interface DeepgramContextInterface {
  children: React.ReactNode;
}

const DeepgramContext = createContext({} as DeepgramContext);

const getApiKey = async (): Promise<string> => {
  const result: CreateProjectKeyResponse = await (
    await fetch("/api/deepgram/api-key", { cache: "no-store" })
  ).json();

  console.log(result, "deepgram-api-key");

  return result.key;
};

const DeepgramContextProvider = ({ children }: DeepgramContextInterface) => {
  // const { toast } = useToast();

  const [connection, setConnection] = useState<LiveClient>();
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connectionReady, setConnectionReady] = useState<boolean>(false);

  const connect = useCallback(async () => {
    if (!connection && !connecting) {
      setConnecting(true);
      try {
        const connection = new LiveClient(
          await getApiKey(),
          {},
          {
            model: "nova-1",
          }
        );
        console.log(connection);
        setConnection(connection);
        toast.success("Microphone connected");
        toast.dismiss();
        setConnecting(false);
      } catch (error) {
        toast.error("error occured");
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connecting, connection]);

  useEffect(() => {
    if (typeof window !== "undefined" && connection === undefined) {
      console.log("connecting");
      toast.loading("Connecting to microphone");
      connect();
    }
  }, [connection, connect]);

  useEffect(() => {
    if (connection) {
      connection.addListener(LiveTranscriptionEvents.Open, () => {
        setConnectionReady(true);
      });

      connection.addListener(LiveTranscriptionEvents.Close, () => {
        console.error("WebSocket closed. Attempting to reconnect...");
        setTimeout(() => {
          setConnection(undefined); // Trigger a reconnection attempt
        }, 2000);
        setConnectionReady(false);
      });

      connection.addListener(LiveTranscriptionEvents.Error, (error) => {
        console.error("WebSocket error:", error);
        setTimeout(() => {
          setConnection(undefined); // Trigger a reconnection attempt
        }, 2000);
        setConnectionReady(false);
      });

      return () => {
        connection.removeAllListeners();
      };
    }
  }, [connection]);

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connectionReady,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram() {
  return useContext(DeepgramContext);
}

export { DeepgramContextProvider, useDeepgram };
