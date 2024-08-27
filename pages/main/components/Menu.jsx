import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, StyleSheet, Text, Alert } from "react-native";
import CreateDeckAlert from "../../Decks/CreateDecks/components/CreateAlert";
import { useContext, useState } from "react";
import { GlobalContext } from "../../../GlobalContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "../../../database/firebase";
import { Snackbar } from "react-native-paper";

const Menu = ({ user }) => {
  const [visible, setVisible] = useState(false);
  const { userId, setDeckId, deckId, setDeckName } = useContext(GlobalContext);
  const [snackbar, setSnack] = useState(false);
  const onToggleSnackBar = () => setSnack(!snackbar);
  const onDismissSnackBar = () => setSnack(false);

  const navigation = useNavigation();
  const GoToInvetary = () => {
    user ? navigation.navigate("Inventory") : "";
  };
  const goToCreateDeck = () => {
    deckId ? navigation.navigate("CreateDeck") : "";
  };
  const goToSavedDecks = () => {
    user ? navigation.navigate("SavedDecks") : "";
  };

  const db = getFirestore(app);
  const togleVisible = () => {
    setVisible(true);
  };
  const confirmCreate = async (name) => {
    if (name != "") {
      try {
        const nameQuery = query(
          collection(db, `users/${userId}/decks`),
          where("name", "==", name)
        );
        const querySnapshot = await getDocs(nameQuery);
        if (!querySnapshot.empty) {
          throw new Error("Ya tienes un mazo con ese nombre");
        }

        const userDecksCollection = collection(db, `users/${userId}/decks`);
        const newDeckRef = doc(userDecksCollection);

        await setDoc(newDeckRef, {
          name,
          limitaciones: null,
        });

        onToggleSnackBar();
        cancelCreate();
        const Idquery = query(
          collection(db, `users/${userId}/decks`),
          where("name", "==", name)
        );
        const IdquerySnap = await getDocs(Idquery);
        await setDeckId(IdquerySnap.docs[0].id);
        await setDeckName(name);
        cancelCreate();
        onDismissSnackBar();
        goToCreateDeck();
        console.log("Deck added successfully!");
      } catch (error) {
        Alert.alert("ERROR: " + error);
      }
    } else {
      Alert.alert("Ingresa un nombre valido");
    }
  };
  const cancelCreate = () => {
    setVisible(false);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={user ? togleVisible : ""}>
        <Text style={styles.text}>Crear mazo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={user ? GoToInvetary : ""}>
        <Text style={styles.text}>Inventario</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={user ? goToSavedDecks : ""}>
        <Text style={styles.text}>Mazos guardados</Text>
      </TouchableOpacity>
      <CreateDeckAlert
        visible={visible}
        onConfirm={confirmCreate}
        onCancel={cancelCreate}
        message="Ingresa el nombre de el mazo"
      />
      <Snackbar
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        action={{
          label: "close",
          onPress: () => {
            onDismissSnackBar();
          },
        }}
        style={{ position: "absolute", bottom: -450, left: -105 }}
      >
        Mazo creado con exito! redireccionando...
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "start",
    justifyContent: "center",
    gap: 15,
  },
  text: {
    fontSize: 25,
    borderBottomColor: "#545454",
    borderBottomWidth: 1,
    color: "#545454",
    ShadowColor: "#f6f6f6",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Menu;
