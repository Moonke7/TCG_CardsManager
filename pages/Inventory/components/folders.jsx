import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Card from "./card";
import { GlobalContext } from "../../../GlobalContext";
import { app } from "../../../database/firebase";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomAlert from "./deleteAlert";

const Folder = () => {
  const { folderId, folderName } = useContext(GlobalContext);

  const [cardsData, setCardsData] = useState(null);
  const db = getFirestore(app);
  const CardsCollection = collection(db, `/folders/${folderId}/cards`);

  useEffect(() => {
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
  }, []);
  const navigation = useNavigation();

  const GoToInventory = () => {
    navigation.navigate("Inventory");
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleDeleteFolder = (folderId) => {
    setSelectedFolder(folderId);
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "folders", selectedFolder)); 
      setAlertVisible(false);
      console.log(`Folder with ID: ${selectedFolder} deleted`);
      navigation.navigate("Inventory")
    } catch (error) {
      console.error("Error deleting folder: ", error);
    }
  };

  const cancelDelete = () => {
    setAlertVisible(false);
    setSelectedFolder(null);
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
            style={{ position: "absolute", top: 25, right: 10 }}
          >
            <Ionicons
              name="chevron-back-circle-outline"
              size={32}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCarts}>
            <Text style={{ fontSize: 17 }}>Agregar cartas</Text>
            <AntDesign name="plus" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteFolder} onPress={() => handleDeleteFolder(folderId)}>
            <Text style={{ fontSize: 15 }}>Eliminar carpeta</Text>
            <AntDesign name="minus" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.tittle}>{folderName}</Text>
        </View>
        <CustomAlert
          visible={alertVisible}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message="Seguro que quieres borrar esta carpeta?"
        />
        {cardsData ? (
          cardsData.map((card) => (
            <View key={card.id} style={styles.cards__container}>
              <Card card={card} />
            </View>
          ))
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
});
export default Folder;
