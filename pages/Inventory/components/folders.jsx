import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { GlobalContext } from "../../../GlobalContext";
import { app } from "../../../database/firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomAlert from "./deleteFolderAlert";
import CardPreviewInventory from "./cardInventoryPreview";
import { combinedData } from "../../../database/Cards/combinedData";

const Folder = () => {
  const { folderId, folderName, userId } = useContext(GlobalContext);

  const [cardsData, setCardsData] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const db = getFirestore(app);
  const CardsCollection = collection(
    db,
    `users/${userId}/folders/${folderId}/cards`
  );

  const LoadFolders = () => {
    getDocs(CardsCollection)
      .then((snapshot) => {
        const cardsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCardsData(cardsArray);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  };
  useFocusEffect(
    useCallback(() => {
      LoadFolders();
    }, [])
  );
  const navigation = useNavigation();

  const GoToInventory = () => {
    navigation.navigate("Inventory");
  };

  const goToAddCards = () => {
    navigation.navigate("AddCards");
  };
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleDeleteFolder = (folderId) => {
    setSelectedFolder(folderId);
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    /* arreglar */
    try {
      await deleteDoc(doc(db, `users/${userId}/folders`, selectedFolder));
      setAlertVisible(false);
      console.log(`Folder with ID: ${selectedFolder} deleted`);
      navigation.navigate("Inventory");
    } catch (error) {
      console.error("Error deleting folder: ", error);
    }
  };

  const cancelDelete = () => {
    setAlertVisible(false);
    setSelectedFolder(null);
  };
  const CancelView = () => {
    setViewVisible(false);
  };
  const SelectCard = (id) => {
    const card = combinedData.find((card) => card.id === id);
    if (card) {
      setSelectedCard(card);
      setViewVisible(true);
    } else {
      console.error("Card not found!");
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
        <View style={styles.info__container}>
          <TouchableOpacity
            onPress={GoToInventory}
            style={{ position: "absolute", top: 35, left: 10 }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCarts} onPress={goToAddCards}>
            <Text style={{ fontSize: 17 }}>Agregar cartas</Text>
            <AntDesign name="plus" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteFolder}
            onPress={() => handleDeleteFolder(folderId)}
          >
            <Text style={{ fontSize: 15 }}>Eliminar almacen</Text>
            <AntDesign name="minus" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.tittle}>{folderName}</Text>
        </View>
        <CustomAlert
          visible={alertVisible}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message="Seguro que quieres eliminar este almacen?"
        />
        <CardPreviewInventory
          visible={viewVisible}
          onCancel={CancelView}
          imgSrc={selectedCard ? selectedCard.imgURL : ""}
          selectedCard={selectedCard ? selectedCard : ""}
        />
        {cardsData ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {cardsData.map((card) => (
              <View key={card.id} style={styles.cards__container}>
                <TouchableOpacity onPress={() => SelectCard(card.id)}>
                  <Image
                    source={{ uri: card.img }}
                    style={{ width: 70, height: 90 }}
                  />
                </TouchableOpacity>
                <View style={styles.contador}>
                  <Text
                    style={{ fontSize: 10, fontWeight: "bold", color: "white" }}
                  >
                    {card.cantidad}
                  </Text>
                </View>
              </View>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cards__container: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  container: {
    opacity: 0.9,
    width: "100%",
    height: "100%",
    backgroundColor: "#ededed",
    alignItems: "center",
  },
  info__container: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#464646",
    borderBottomWidth: 2,
    width: "95%",
  },
  addCarts: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    left: 10,
  },
  tittle: {
    fontSize: 35,
    fontWeight: "bold",
  },
  deleteFolder: {
    position: "absolute",
    bottom: 5,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 400,
    gap: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  contador: {
    position: "absolute",
    top: -5,
    right: -3,
    width: 20,
    height: 20,
    backgroundColor: "#525252",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Folder;
