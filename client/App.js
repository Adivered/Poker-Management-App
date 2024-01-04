import React from "react";
import DrawerNavigator from "./navigator/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { DataProvider } from "./providers/DataProvider";
import TokenRefreshHandler from "./providers/TokenRefreshHandler";
import { GameDataProvider } from "./providers/GameDataProvider";
import { ThemeProvider } from "./utils/theme";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <DataProvider>
          <GameDataProvider>
            <DrawerNavigator />
          </GameDataProvider>
          <TokenRefreshHandler />
        </DataProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
