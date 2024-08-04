import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrincipalPage from "./pages/main/PrincipalPage";
import Inventory from "./pages/Inventory/inventory";
import { ContextProvider } from "./GlobalContext";
import AddFolder from "./pages/Inventory/components/addFolder";
import Folder from "./pages/Inventory/components/folders";
import LoginScreen from "./pages/login/loginScreen";
import CreateAccount from "./pages/register/register";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./database/firebase";
import AddCards from "./pages/Inventory/components/addCarts";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loged, setLoged] = useState("Login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoged("Home")
      } else {
        setLoged("Login");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={loged}>
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
          <Stack.Screen
            name="AddCards"
            component={AddCards}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}
