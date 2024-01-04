// AppNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import CreateMatch from "../views/Mainpage/CreateMatch";
import GameLobby from "../views/Mainpage/GameLobby";
import Homepage from "../views/Mainpage/Homepage/Homepage";
import NavBarFrame from "../components/NavBarFrame";
import ActiveRoom from "../components/ActiveRoom";
import LoginScreen from "../views/Auth/LoginScreen";
import RegistrationScreen from "../views/Auth/Registration";
const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        title: null,
        headerTransparent: true,
        headerMode: "screen",
      }}
      initialRouteName={"Home"}
    >
      <Stack.Screen
        name="Home"
        options={{
          headerLeft: (props) => <NavBarFrame {...props} />,
          headerLeftContainerStyle: {
            paddingLeft: 8,
          },
          headerRightContainerStyle: {
            paddingRight: 8,
          },
        }}
        component={Homepage}
      />
      <Stack.Screen
        name="Login"
        options={{
          headerTintColor: "#9400d3",
        }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="SignUp"
        options={{
          headerTintColor: "#9400d3",
        }}
        component={RegistrationScreen}
      />

      <Stack.Screen
        name="CreateMatch"
        options={{
          headerTintColor: "#9400d3",
        }}
        component={CreateMatch}
      />
      <Stack.Screen
        name="GameLobby"
        options={{
          title: "GAME LOBBY",
          headerTitleStyle: {
            color: "#ffffff",
            fontFamily: "Card-Characters",
            fontSize: "16pt",
            fontWeight: "700",
            textAlign: "center",
            letterSpacing: 1.6,
          },
          headerTitleAlign: "center",

          headerLeft: (props) => <NavBarFrame {...props} />,
          headerLeftContainerStyle: {
            paddingLeft: 8,
          },
          headerRightContainerStyle: {
            paddingRight: 8,
          },
        }}
        component={GameLobby}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
