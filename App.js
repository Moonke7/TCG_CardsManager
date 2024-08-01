import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrincipalPage from "./pages/main/PrincipalPage";
import Inventory from "./pages/Inventory/inventory";
import { ContextProvider } from "./GlobalContext";
import AddFolder from "./pages/Inventory/components/addFolder";
import Folder from "./pages/Inventory/components/folders";
import LoginScreen from "./pages/login/loginScreen";
import CreateAccount from "./pages/register/register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Home"
            component={PrincipalPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Inventory"
            component={Inventory}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateFolder"
            component={AddFolder}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Folder"
            component={Folder}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={CreateAccount}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}
