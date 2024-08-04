import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Multicolor } from "../../../database/Cards/OpCards - multicolor";
import { BlackCards } from "../../../database/Cards/OpCards - black";
import { combinedData } from "../../../database/Cards/combinedData";
import Header from "../../main/components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import { useContext, useEffect, useState } from "react";
import CardPreview from "./cardPreview";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalContext } from "../../../GlobalContext";
import { app } from "../../../database/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import ViewCards from "./viewCards";
import DeleteAlert from "./deleteFolderAlert";

const AddCards = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(Multicolor);
  const [alertVisible, setAlertVisible] = useState(false);
  const [AddAlert, setAddAlert] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [viewVisible, setViewVisible] = useState(false);
  const { folderId, userId, folderName } = useContext(GlobalContext);

  const db = getFirestore(app);

  const navigation = useNavigation();
  const goBack = () => {
    navigation.navigate("Folder");
  };

  const updateSearch = (e) => {
    setSearch(e);
  };

  const filter = () => {
    if (search == "") {
      setResults(Multicolor);
      return;
    }
    const filteredResults = combinedData.filter(
      (card) =>
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.id.toString().includes(search)
    );
    if (filteredResults.length == 0) {
      Alert.alert("No hay resultados para esta busqueda");
      setResults(Multicolor);
      setSearch("");
    } else {
      setResults(filteredResults);
    }
  };

  const HandleAdd = (id) => {
    const card = combinedData.find((card) => card.id === id);
    if (card) {
      setSelectedCard(card);
      setAlertVisible(true);
    } else {
      console.error("Card not found!");
    }
  };

  const confirmAdd = async () => {
    const CardsNumber = cantidad;
    const CardToAdd = selectedCard;
    if (CardsNumber > 0) {
      try {
        const CardsToAddCollection = collection(
          db,
          `users/${userId}/folders/${folderId}/recentAdded`
        );

        const cardQuery = query(
          CardsToAddCollection,
          where("id", "==", CardToAdd.id)
        );
        const querySnapshot = await getDocs(cardQuery);
        if (!querySnapshot.empty) {
          // La carta ya existe, actualiza la cantidad
          const cardDoc = querySnapshot.docs[0];
          const existingCard = cardDoc.data();
          const newCantidad = existingCard.cantidad + CardsNumber;

          await updateDoc(cardDoc.ref, { cantidad: newCantidad });

          console.log("Card quantity updated successfully!");
        } else {
          // La carta no existe, añade un nuevo documento
          const newCardRef = doc(CardsToAddCollection);
          await setDoc(newCardRef, {
            cantidad: CardsNumber,
            name: CardToAdd.name,
            id: CardToAdd.id,
            power: CardToAdd.power,
            category: CardToAdd.category,
            type: CardToAdd.type,
            cost: CardToAdd.cost,
            attribute: CardToAdd.atribbute,
            effect: CardToAdd.effect,
            img: CardToAdd.imgURL,
          });

          console.log("Card added successfully!");
        }

        setAlertVisible(false);
        setCantidad(0);
        setSelectedCard(null);
      } catch (error) {
        console.log(error);
        Alert.alert("ERROR: " + error);
      }
    }
  };

  const cancelDelete = () => {
    setAlertVisible(false);
    setAddAlert(false)
    setSelectedCard(null);
    setCantidad(0);
  };

  const AddOne = () => {
    setCantidad(cantidad + 1);
  };
  const MinusOnce = () => {
    if (cantidad > 0) {
      setCantidad(cantidad - 1);
    }
  };

  const CancelView = () => {
    setViewVisible(false);
  };
  const HandleView = () => {
    setViewVisible(true);
  };

  const HandleAddAlert = () =>{
    setAddAlert(true);
  };
  const cancelAdd = () => {
    setAddAlert(false);
  };
  const AddCardsToUser = async () => {
    try {
      const recentAddedCollection = collection(db, `users/${userId}/folders/${folderId}/recentAdded`);
      const cardsCollection = collection(db, `users/${userId}/folders/${folderId}/cards`);
      
      const querySnapshot = await getDocs(recentAddedCollection);
  
      for (const cardDoc of querySnapshot.docs) {
        const cardData = cardDoc.data();
  
        const cardQuery = query(cardsCollection, where("id", "==", cardData.id));
        const cardQuerySnapshot = await getDocs(cardQuery);
  
        if (!cardQuerySnapshot.empty) {
          const existingCardDoc = cardQuerySnapshot.docs[0];
          const existingCardData = existingCardDoc.data();
          const newCantidad = existingCardData.cantidad + cardData.cantidad;
          await updateDoc(existingCardDoc.ref, { cantidad: newCantidad });
          console.log(`Card ${cardData.name} quantity updated successfully!`);
        } else {
          const newCardRef = doc(cardsCollection);
          await setDoc(newCardRef, cardData);
          console.log(`Card ${cardData.name} added successfully!`);
        }
        await deleteDoc(cardDoc.ref);
      }
      console.log("All cards transferred and recentAdded emptied successfully!");
      setAddAlert(false);
    } catch (error) {
      console.error("Error transferring cards: ", error);
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
        <Header />
        <View style={styles.top__info}>
          <TouchableOpacity
            style={{ top: 40, position: "absolute" }}
            onPress={goBack}
          >
            <Ionicons
              name="chevron-back-circle-outline"
              size={32}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.buttons__container}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              onPress={HandleAddAlert}
            >
              <Text style={{ color: "#203429" }}>Guardar</Text>
              <AntDesign name="save" size={18} color="#203429" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              onPress={HandleView}
            >
              <Text style={{ color: "#292929" }}>Ver cartas</Text>
              <Fontisto name="preview" size={16} color="#292929" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={updateSearch}
            value={search}
            placeholder="Buscar por nombre / id "
          />
          <Feather
            name="search"
            size={24}
            color="black"
            style={styles.lupa}
            onPress={filter}
          />
        </View>
        {results.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {results.map((card) => (
              <TouchableHighlight
                key={card.id}
                onPress={() => HandleAdd(card.id)}
              >
                <ImageBackground
                  source={{ uri: card.imgURL }}
                  style={styles.card}
                >
                  <View style={{ flex: 1 }}></View>
                </ImageBackground>
              </TouchableHighlight>
            ))}
          </ScrollView>
        ) : (
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: "https://media.tenor.com/of43hCTlDrUAAAAj/one-piece-z-studios.gif",
            }}
          />
        )}
      </View>
      <DeleteAlert
        visible={AddAlert}
        onConfirm={AddCardsToUser}
        onCancel={cancelAdd}
        message={"Añadiras las cartas guardadas previamente al almacen: " + folderName}
      />
      <CardPreview
        visible={alertVisible}
        onConfirm={confirmAdd}
        onCancel={cancelDelete}
        message={
          selectedCard
            ? "Estas añadiendo a " +
              selectedCard.name +
              ". Selecciona la cantidad de cartas que deseas añadir"
            : ""
        }
        imgSrc={selectedCard ? selectedCard.imgURL : ""}
        selectedCard={selectedCard ? selectedCard : ""}
        cantidad={cantidad}
        añadirCantidad={AddOne}
        quitarCantidad={MinusOnce}
      />
      <ViewCards visible={viewVisible} onCancel={CancelView} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#ededed",
    opacity: 0.85,
  },
  input: {
    borderColor: "#292929",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: "50%",
    marginVertical: 8,
    fontSize: 14,
    backgroundColor: "#e7e7e7",
    color: "#292929",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: 60,
    height: 90,
  },
  scrollContent: {
    flexGrow: 1,
    paddingLeft: "4%",
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    gap: 15,
    alignSelf: "center",
  },
  top__info: {
    height: 150,
    width: "98%",
    borderBottomColor: "#374378",
    borderBottomWidth: 0.5,
    paddingBottom: 3,
    paddingHorizontal: 5,
    marginBottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  buttons__container: {
    height: 50,
    justifyContent: "space-between",
  },
  lupa: {
    position: "absolute",
    right: 10,
    bottom: 17,
  },
});

export default AddCards;
