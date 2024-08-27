import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import RulesAlert from "./components/RulesAlert";
import { useCallback, useContext, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AllCards from "./components/AllCards";
import { combinedData } from "../../../database/Cards/combinedData";
import Deck from "./components/Deck";
import { GlobalContext } from "../../../GlobalContext";
import EditAlert from "./components/EditAlert";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../../database/firebase";
import { Snackbar } from "react-native-paper";
import ExportImportAlert from "./components/ExportImport";

const CreateDeck = () => {
  const [alert, setAlert] = useState(false);
  const [editAlert, setEditAlert] = useState(false);
  const [contador, setContador] = useState(0);
  const [cardsAdded, setCardsAdded] = useState([]);
  const [LongPressedCard, setLongPressedCard] = useState(null);
  const [limitations, setLimitations] = useState(false);
  const { deckName, deckId, userId, setDeckName, setFolders } =
    useContext(GlobalContext);
  const [Diseños, setDiseños] = useState(null);
  const [loading, setLoading] = useState(false);

  const [LiderColor, setLiderColor] = useState("");
  const [Lider, setLider] = useState("");
  const [LimitSnack, setLimitSnack] = useState(false);
  const ToggleLimitSnack = () => setLimitSnack(!LimitSnack);
  const dismissLimit = () => setLimitSnack(false);

  const [ExportAlert, setExportAlert] = useState(false);
  const ToggleExport = () => setExportAlert(!ExportAlert);
  const [ExportSnack, setExportSnack] = useState(false);
  const toggleExportSnack = () => setExportSnack(!ExportSnack);

  const db = getFirestore(app);

  const AddCard = async (id) => {
    if ((limitations && contador < 51) || !limitations) {
      const card = combinedData.find((card) => card.id === id);
      if (card) {
        const obj = {
          id: card.RealId,
          cards: [card],
        };
        if (card.category === "LEADER" && Lider === "" && limitations) {
          setLider(card.name);
          setLiderColor(card.color.includes("/") ? "Orange" : card.color);
          console.log(LiderColor);
        } else if (card.category === "LEADER" && Lider !== "" && limitations) {
          Alert.alert("Solo puede haber un lider por mazo!");
          return;
        }

        const searchIndex = cardsAdded.findIndex((item) => item.id === obj.id);
        let newCards;

        if (
          (limitations &&
            (searchIndex === -1 ||
              cardsAdded[searchIndex]?.cards.length < 4)) ||
          !limitations
        ) {
          if (searchIndex !== -1) {
            newCards = [...cardsAdded];
            newCards[searchIndex].cards = [
              ...newCards[searchIndex].cards,
              card,
            ];
          } else {
            newCards = [...cardsAdded, obj];
          }

          setContador((prevCount) => prevCount + 1);
          setCardsAdded(newCards);
        } else {
          dismissLimit();
          ToggleLimitSnack();
          return;
        }
      } else {
        console.error("Card not found!");
      }
    }
  };

  const LoadCards = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const CardsCollection = collection(
        db,
        `users/${userId}/decks/${deckId}/cards`
      );
      const snapshot = await getDocs(CardsCollection);

      if (!snapshot.empty) {
        let newCards = [];
        let liderFound = false; // Variable para rastrear si se encontró una carta de líder

        snapshot.forEach((doc) => {
          const cardData = { id: doc.id, ...doc.data() };
          const card = combinedData.find((item) => item.id === cardData.id);

          if (card) {
            const existingIndex = newCards.findIndex(
              (item) => item.id === card.RealId
            );

            if (existingIndex !== -1) {
              newCards[existingIndex].cards.push(card);
            } else {
              newCards.push({ id: card.RealId, cards: [card] });
            }

            // Verificar si la carta es de la categoría líder
            if (card.category === "LEADER" && !liderFound) {
              setLider(card.name);
              liderFound = true; // Evitar actualizar varias veces si hay más de una carta de líder
            }
          }
        });

        setCardsAdded(newCards);
        setContador(
          newCards.reduce((sum, cardGroup) => sum + cardGroup.cards.length, 0)
        );
      } else {
        console.log("No se encontraron cartas en la colección.");
      }

      const deckDocRef = doc(db, `users/${userId}/decks/${deckId}`);
      const deckDoc = await getDoc(deckDocRef);

      if (deckDoc.exists()) {
        const deckData = deckDoc.data();
        const limitaciones = deckData.limitaciones;
        const name = deckData.name;
        setDeckName(name);

        if (limitaciones != null) {
          setLimitations(limitaciones);
        } else {
          setAlert(true);
        }
      } else {
        console.log("No se encontró el deck con el ID especificado.");
      }
    } catch (error) {
      console.error("Error al cargar las cartas: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId && deckId) {
        LoadCards();
      } else {
        console.error("userId o deckId no están definidos.");
      }
    }, [userId, deckId])
  );

  const removeAlert = () => {
    setAlert(false);
  };
  const handleEditAlert = () => {
    setEditAlert(!editAlert);
  };

  const navigation = useNavigation();
  const goSavedDecks = () => {
    navigation.navigate("SavedDecks");
  };

  const UpdateLimitations = async (newLimitations) => {
    try {
      if (!userId || !deckId) {
        throw new Error("userId o deckId no están definidos.");
      }
      const deckDocRef = doc(db, `users/${userId}/decks/${deckId}`);
      await updateDoc(deckDocRef, {
        limitaciones: newLimitations,
      });
      console.log("Limitations actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar limitations:", error);
    }
  };
  const noLimitations = () => {
    UpdateLimitations(false);
    setLimitations(false);
    removeAlert();
  };
  const Limitations = () => {
    UpdateLimitations(true);
    setLimitations(true);
    removeAlert();
  };

  const LongPressToEdit = (id) => {
    const cardPressedIndex = cardsAdded.findIndex((card) => card.id === id);
    setLongPressedCard(cardsAdded[cardPressedIndex].cards);
    const di = combinedData.filter((card) => card.RealId === id);
    setDiseños(di);
    handleEditAlert();
  };

  const ClearFolders = () => {
    setFolders([]);
  };
  useFocusEffect(
    useCallback(() => {
      ClearFolders();
    }, [])
  );

  const ExportCards = async () => {
    console.log(limitations)
    if(cardsAdded.length < 1){
      Alert.alert("No has agregado ninguna carta para exportar!")
      return
    }

    //poner las limitaciones del mazo primero
    let text = `Limitaciones = ${limitations},\n`;
    //en caso de que hayan cartas, se copian todas las ids
    for (const group of cardsAdded) {
      for (const card of group.cards) {
        text = text + card.id + ",\n";
      }
    }
    text = text.trim().slice(0, -1);
    await Clipboard.setStringAsync(text);
    ToggleExport();
    toggleExportSnack();
    console.log(text)
  };


  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/05/30/08/053008e96e6929f75ab889ec21a3f074.jpg",
      }}
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "500" }}>Limitaciones: </Text>
              <Text
                style={
                  limitations
                    ? { color: "blue", fontWeight: "bold" }
                    : { color: "red", fontWeight: "bold" }
                }
              >
                {limitations ? "On" : "Off"}
              </Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>{deckName}</Text>
          </View>

          <View style={{ alignItems: "flex-start", gap: 5 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={goSavedDecks}
            >
              <Text>Mazos guardados</Text>
              <Ionicons name="chevron-back-sharp" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={ToggleExport}>
              <Text style={{}}>Importar / exportar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Deck
          data={cardsAdded}
          contador={contador}
          setCardsAdded={setCardsAdded}
          setContador={setContador}
          limitations={limitations}
          LongPress={LongPressToEdit}
          lider={Lider}
          setLider={setLider}
          liderColor={LiderColor}
        />

        <AllCards addCard={AddCard} loading={loading} />

        <RulesAlert
          message={"Como desea crear su mazo?"}
          visible={alert}
          onCancel={Limitations}
          onConfirm={noLimitations}
        />

        <EditAlert
          onCancel={handleEditAlert}
          visible={editAlert}
          data={LongPressedCard}
          diseños={Diseños}
          cardsAdded={cardsAdded}
          setCardsAdded={setCardsAdded}
          setData={setLongPressedCard}
          setcontador={setContador}
        />

        <Snackbar
          style={{ width: "90%", alignSelf: "center" }}
          visible={LimitSnack}
          onDismiss={dismissLimit}
          action={{
            label: "close",
            onPress: () => {
              ToggleLimitSnack();
            },
          }}
        >
          Solo puedes añadir 4 cartas iguales!
        </Snackbar>

        <ExportImportAlert
          visible={ExportAlert}
          onCancel={ToggleExport}
          ExportCards={ExportCards}
          togleAlert={ToggleExport}
          setCardsAdded={setCardsAdded}
          limitations={limitations}
        />
        <Snackbar
          style={{ width: "90%", alignSelf: "center" }}
          visible={ExportSnack}
          onDismiss={toggleExportSnack}
          action={{
            label: "close",
            onPress: () => {
              toggleExportSnack();
            },
          }}
        >
          Cartas copiadas al portapapeles!
        </Snackbar>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#ededed",
    opacity: 0.95,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
export default CreateDeck;
