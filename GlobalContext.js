import { collection, getDoc } from "firebase/firestore";
import React, { useState, createContext, useEffect } from "react";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const [folderId, setFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [deckId, setDeckId] = useState(null);
  const [deckName, setDeckName] = useState("");

  const [Folders, setFolders] = useState([]);
  const [searchedCards, setSearchedCards] = useState([]);

  const AddFolderToSearchCards = (folder) => {
    setFolders((prevFolders) => [...prevFolders, folder]);
    console.log(Folders);
  };

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
        deckId,
        setDeckId,
        deckName,
        setDeckName,
        AddFolderToSearchCards,
        Folders,
        setSearchedCards,
        searchedCards,
        setFolders,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
