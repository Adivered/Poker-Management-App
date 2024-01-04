import React, { useState, createContext, useEffect } from "react";
import makeApiRequest from "./ApiRequest";

export const GameContext = createContext();

export const GameDataProvider = ({ children }) => {
  const [gameActive, setGameActive] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [localPlayersSelected, setLocalPlayersSelected] = useState([]);
  const [gameID, setGameID] = useState();
  const [isGameAdmin, setIsGameAdmin] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [pricePerEntry, setPricePerEntry] = useState(50);
  const [entries, setEntries] = useState([]);
  const [pot, setPot] = useState(0);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchInitialGameData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          makeApiRequest(
            "get_initial_game_data",
            "GET",
            accessToken,
            (initialGameData) => {
              setAvailablePlayers(initialGameData.availablePlayers);
              setPricePerEntry(initialGameData.defaultPricePerEntry);
            },
            {
              successCodes: [200],
              errorMsgTitle: "Error fetching initial game data",
            }
          );
        } else {
          console.warn("Access token is missing. Skipping API request.");
        }
      } catch (error) {
        console.error("Error fetching initial game data:", error.message);
      }
    };

    fetchInitialGameData();
  }, []);

  const updatePlayerEntries = (playerName, newEntries) => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) =>
        player.username === playerName
          ? { ...player, entries: newEntries }
          : player
      );
    });
  };

  const clearUserData = () => {
    // Reset or clear relevant state variables
    setGameActive(false);
    setAvailablePlayers([]);
    setPlayers([]);
    setLocalPlayersSelected([]);
    setGameID(undefined);
    setIsGameAdmin(false);
    setNumberOfPlayers(0);
    setPricePerEntry(50);
    setEntries([]);
    setPot(0);
    setLocation("");
  };

  const removePlayer = (playerName) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.username !== playerName)
    );
  };

  const contextValue = {
    gameActive,
    setGameActive,
    availablePlayers,
    setAvailablePlayers,
    players,
    setPlayers,
    isGameAdmin,
    setIsGameAdmin,
    localPlayersSelected,
    setLocalPlayersSelected,
    numberOfPlayers,
    setNumberOfPlayers,
    gameID,
    setGameID,
    pricePerEntry,
    setPricePerEntry,
    pot,
    setPot,
    entries,
    setEntries,
    location,
    setLocation,
    updatePlayerEntries,
    removePlayer,
    clearUserData,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
