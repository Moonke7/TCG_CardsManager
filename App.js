import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrincipalPage from "./pages/main/PrincipalPage";
import Inventory from "./pages/Inventory/inventory";
import { ContextProvider, GlobalContext } from "./GlobalContext";
import AddFolder from "./pages/Inventory/components/addFolder";
import Folder from "./pages/Inventory/components/folders";
import LoginScreen from "./pages/login/loginScreen";
import CreateAccount from "./pages/register/register";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { app, auth } from "./database/firebase";
import AddCards from "./pages/Inventory/components/addCarts";
import { Image, Text, View } from "react-native";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import CreateDeck from "./pages/Decks/CreateDecks/CreateDeck";
import SavedDecks from "./pages/Decks/SavedDecks/SavedDecks";
import SearchCards from "./pages/Decks/SavedDecks/components/SearchCards";

const Stack = createNativeStackNavigator();

function AppContent() {
  const [loged, setLoged] = useState(null);
  const { setUsername, setUserId } = useContext(GlobalContext);

  const db = getFirestore(app)
  const GetUsername = async (id) => {
    try {
      const userDocRef = doc(db, `users/${id}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().username;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoged("Home");
        setUserId(user.uid);
        setUsername(GetUsername(user.uid))
      } else {
        setLoged("Login");
      }
    });

    return () => unsubscribe();
  }, [setUserId]);

  if (loged === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 15 }}>
        <Image
          style={{ width: 300, height: 300 }}
          source={{
            uri: "https://media.tenor.com/of43hCTlDrUAAAAj/one-piece-z-studios.gif",
          }}
        />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
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
        <Stack.Screen
          name="CreateDeck"
          component={CreateDeck}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SavedDecks"
          component={SavedDecks}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchCards"
          component={SearchCards}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ContextProvider>
      <AppContent />
    </ContextProvider>
  );
}
