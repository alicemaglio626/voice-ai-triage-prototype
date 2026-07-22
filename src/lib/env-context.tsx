"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

type Env = "prod" | "test";

interface EnvContextValue {
  env: Env;
  setEnv: (env: Env) => void;
  isTest: boolean;
}

const EnvContext = createContext<EnvContextValue>({
  env: "prod",
  setEnv: () => {},
  isTest: false,
});

function getStoredEnv(): Env {
  if (typeof window === "undefined") return "prod";
  const stored = localStorage.getItem("offsite-env");
  return stored === "test" ? "test" : "prod";
}

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function EnvProvider({ children }: { children: React.ReactNode }) {
  const env = useSyncExternalStore(
    subscribe,
    getStoredEnv,
    () => "prod" as Env,
  );

  const setEnv = useCallback((newEnv: Env) => {
    localStorage.setItem("offsite-env", newEnv);
    for (const listener of listeners) listener();
  }, []);

  return (
    <EnvContext.Provider value={{ env, setEnv, isTest: env === "test" }}>
      {children}
    </EnvContext.Provider>
  );
}

export function useEnv() {
  return useContext(EnvContext);
}
