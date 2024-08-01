import React, { useState, createContext, useEffect } from "react";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const [folderId, setFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        folderId,
        setFolderId,
        setFolderName,
        folderName,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
