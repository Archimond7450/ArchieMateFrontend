import React, { createContext, useState, ReactNode, useContext } from "react";
import User from "../DTOs/User";

interface GlobalState {
  loggedUser?: User;
}

const initialState: GlobalState = {
  loggedUser: undefined,
};

interface GlobalStateContextProps {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export const GlobalStateContext = createContext<
  GlobalStateContextProps | undefined
>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalState>(initialState);

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
