import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import react, { useCallback, useContext, useState } from "react";
import { app } from "../../../database/firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../../../GlobalContext";
import Header from "../../main/components/Header";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

const SavedDecks = () => {
  const [decksData, setDecksData] = useState(null);
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(null);
  const db = getFirestore(app);
  const { deckId, userId, setDeckId } = useContext(GlobalContext);

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
          style={{ position: "absolute", top: 35, left:  15 }}
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
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <Text>Eliminar Mazo</Text>
                        <AntDesign name="close" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text>Editar Mazo</Text>
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
  },
  options__show: {
    right: 25,
  },
});
export default SavedDecks;
