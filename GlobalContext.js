import React, { useState, createContext, useEffect } from "react";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const [folderId, setFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        folderId,
        setFolderId,
        setFolderName,
        folderName,
        userId,
        setUserId,
        username,
        setUsername,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
