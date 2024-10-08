import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../database/firebase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalContext } from "../../GlobalContext";

const Inventory = () => {
  const [Folders, setFolders] = useState(null);
  const db = getFirestore(app);
  const { setFolderId, setFolderName, userId } = useContext(GlobalContext);
  const CardsCollection = collection(db, `users/${userId}/folders`);

  const LoadFolders = () => {
    getDocs(CardsCollection)
      .then((snapshot) => {
        const cardsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFolders(cardsArray);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  };

  const navigation = useNavigation();

  const goToHome = () => {
    navigation.navigate("Home");
  };

  const goToCreateFolder = () => {
    navigation.navigate("CreateFolder");
  };

  const goToFolder = async (id, name) => {
    await setFolderId(id);
    await setFolderName(name);
    navigation.navigate("Folder");
  };

  useFocusEffect(
    useCallback(() => {
      LoadFolders();
    }, [])
  );

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/05/30/08/053008e96e6929f75ab889ec21a3f074.jpg",
      }}
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.info__container}>
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Inventario</Text>
          <TouchableOpacity
            onPress={goToHome}
            style={{ position: "absolute", top: 35, left: 5 }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              position: "absolute",
              bottom: 5,
              left: 10,
            }}
            onPress={goToCreateFolder}
          >
            <Text style={{ fontSize: 17 }}>Nuevo almacen</Text>
            <AntDesign name="plus" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{height: 500}}>
          {Folders ? (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {Folders.map((folder) => (
                <View key={folder.id} style={styles.cards__container}>
                  <TouchableOpacity
                    onPress={() => goToFolder(folder.id, folder.name)}
                  >
                    <Text style={styles.folder}>{folder.name}</Text>
                  </TouchableOpacity>
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
    width: "100%",
    backgroundColor: "#ededed",
    alignSelf: "center",
    height: "100%",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingBottom: 25,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "start",
  },
  cards__container: {
    width: "100%",
    alignItems: "start",
    justifyContent: "center",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  folder: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  info__container: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#464646",
    borderBottomWidth: 2,
    width: "95%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingLeft: "2%",
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    gap: 10,
    alignSelf: "center",
  },
});

export default Inventory;
