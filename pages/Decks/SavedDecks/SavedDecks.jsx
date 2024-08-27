import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import react, { useCallback, useContext, useState } from "react";
import { app } from "../../../database/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../../../GlobalContext";
import Header from "../../main/components/Header";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import ChangeName from "./components/ChangeName";
import { Snackbar } from "react-native-paper";
import DeleteAlert from "../../Inventory/components/deleteFolderAlert";

const SavedDecks = () => {
  const [decksData, setDecksData] = useState(null);
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [changeNameAlert, setChangeNameAlert] = useState(false);
  const [NameChangedSnack, setNameChangedSnack] = useState(false);
  const [deleteAlertState, setDeleteAlertState] = useState(false);
  const db = getFirestore(app);
  const { deckId, userId, setDeckId } = useContext(GlobalContext);

  const toggleSnack = () => setNameChangedSnack(!NameChangedSnack);
  const dismissChanged = () => setNameChangedSnack(false);

  const toggleDeleteAlert = () => setDeleteAlertState(!deleteAlertState);
  const DeleteAlertOn = (deck) => {
    setDeleteAlertState(true);
    setSelectedDeck(deck);
  };

  const LoadDecks = () => {
    const DecksCollection = collection(db, `users/${userId}/decks`);
    getDocs(DecksCollection)
      .then((snapshot) => {
        const deckArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDecksData(deckArray);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  };
  useFocusEffect(
    useCallback(() => {
      LoadDecks();
    }, [])
  );

  const navigation = useNavigation();
  const goToDeck = (id) => {
    setDeckId(id);
    navigation.navigate("CreateDeck");
  };
  const goToHome = () => {
    navigation.navigate("Home");
  };

  const ToggleOptions = (index) => {
    setSelectedDeckIndex(index === selectedDeckIndex ? null : index);
  };

  const ToggleChangeName = (deck) => {
    setSelectedDeck(deck);
    setChangeNameAlert(true);
  };

  const CancelChange = () => {
    setChangeNameAlert(false);
  };
  const ConfirmChange = async (name) => {
    const deckDocRef = doc(db, `users/${userId}/decks/${selectedDeck.id}`);
    const docSnap = await getDoc(deckDocRef);

    if (name === "") {
      Alert.alert("Ingresa un nombre valido");
      return;
    }
    if (docSnap.exists()) {
      //actualizar nombre
      await updateDoc(docSnap.ref, { name: name });
      console.log("Nombre cambiado con exito a: " + name);
      setChangeNameAlert(false);
      setSelectedDeckIndex(null);
      setNameChangedSnack(true);
    } else {
      console.log("No se encontró ningún mazo con el ID seleccionado.");
    }
  };

  const confirmDelete = async () => {
    try {
      const deckDocRef = doc(db, `users/${userId}/decks/${selectedDeck.id}`);
      await deleteDoc(deckDocRef);
      console.log("Deck deleted");
      toggleDeleteAlert();
      setSelectedDeckIndex(null);
      LoadDecks(); // Recarga los mazos después de eliminar
    } catch (e) {
      console.log("ERROR: " + e);
    }
  };
  

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/05/30/08/053008e96e6929f75ab889ec21a3f074.jpg",
      }}
      style={styles.image}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={goToHome}
          style={{ position: "absolute", top: 35, left: 15 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>
          Mazos guardados
        </Text>
        {decksData ? (
          <View style={styles.decksContainer}>
            {decksData.map((deck, index) => {
              const isSelected = index === selectedDeckIndex;
              return (
                <View style={styles.decks__container}>
                  <TouchableOpacity
                    key={index}
                    onPress={() => goToDeck(deck.id)}
                  >
                    <Text style={styles.deckName}>{deck.name}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        { fontWeight: "700" },
                        deck.limitaciones === true
                          ? { color: "#438e96" }
                          : { color: "#c44054" },
                      ]}
                    >
                      {deck.limitaciones === true
                        ? "Con limitaciones"
                        : "Sin limitaciones"}
                    </Text>
                    <TouchableOpacity onPress={() => ToggleOptions(index)}>
                      <SimpleLineIcons
                        name="options-vertical"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>

                    <View
                      style={[
                        styles.options__container,
                        isSelected && styles.options__show,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.options__button}
                        onPress={() => DeleteAlertOn(deck)}
                      >
                        <Text>Eliminar Mazo</Text>
                        <AntDesign name="close" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.options__button}
                        onPress={() => ToggleChangeName(deck)}
                      >
                        <Text>Cambiar nombre</Text>
                        <AntDesign name="edit" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: "https://media.tenor.com/of43hCTlDrUAAAAj/one-piece-z-studios.gif",
            }}
          />
        )}
      </View>

      <ChangeName
        visible={changeNameAlert}
        onCancel={CancelChange}
        onConfirm={ConfirmChange}
        message={"Ingresa el nombre que desees"}
      />

      <Snackbar
        visible={NameChangedSnack}
        style={{ width: "90%", alignSelf: "center" }}
        onDismiss={dismissChanged}
        action={{
          label: "close",
          onPress: () => {
            dismissChanged();
          },
        }}
      >
        Nombre actualizado con exito! los cambios pueden tardar en reflejarse
      </Snackbar>

      <DeleteAlert
        visible={deleteAlertState}
        onCancel={toggleDeleteAlert}
        message={"¿Seguro que deseas borrar este mazo?"}
        deckName={selectedDeck ? selectedDeck.name : ""}
        onConfirm={confirmDelete}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#ededed",
    flex: 1,
    opacity: 0.9,
  },
  decks__container: {
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    paddingVertical: 8,
  },
  decksContainer: {
    width: "100%",
    paddingTop: 20,
  },
  deckName: {
    fontSize: 18,
    fontWeight: "400",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  options__container: {
    backgroundColor: "#ededed",
    position: "absolute",
    padding: 5,
    right: -1000,
    gap: 10,
    zIndex: 100,
  },
  options__show: {
    right: 25,
    top: -36,
  },
  options__button: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
export default SavedDecks;
