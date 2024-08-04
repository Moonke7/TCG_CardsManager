import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import { app } from "../../../database/firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { GlobalContext } from "../../../GlobalContext";
import { combinedData } from "../../../database/Cards/combinedData";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

const ViewCards = ({ visible, onCancel }) => {
  const { folderId, userId } = useContext(GlobalContext);
  const [selectedCard, setSelectedCard] = useState(null);
  const [ShowCard, setShowCard] = useState(false);

  const [cardsData, setCardsData] = useState(null);
  const db = getFirestore(app);

  const loadCards = useCallback(() => {
    if (userId && folderId) {
      const cardsCollection = collection(
        db, 
        `users/${userId}/folders/${folderId}/recentAdded`
      );
      getDocs(cardsCollection)
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
    }
  });

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  const HandleShow = (id) => {
    if (ShowCard) {
      setSelectedCard(null);
      setShowCard(false);
    } else {
      const card = combinedData.find((card) => card.id === id);
      if (card) {
        setSelectedCard(card);
        setShowCard(true);
      } else {
        console.error("Card not found!");
      }
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View
            style={
              ShowCard
                ? styles.preview
                : { position: "absolute", left: -1000, opacity: 0 }
            }
          >
            <Image
              source={selectedCard ? { uri: selectedCard.imgURL } : ""}
              style={{ width: "40%", height: "100%", backgroundColor: "black" }}
            />
            <TouchableOpacity
              onPress={HandleShow}
              style={{ position: "absolute", right: 10, top: 10 }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.preview__text}>
              <Text>ID: {selectedCard ? selectedCard.id : ""}</Text>
              <Text>Nombre: {selectedCard ? selectedCard.name : ""}</Text>
              <Text>Color: {selectedCard ? selectedCard.color : ""}</Text>
              <Text>
                Categoria: {selectedCard ? selectedCard.category : ""}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Cartas a agregar:
          </Text>
          {cardsData ? (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {cardsData.map((card) => (
                <View key={card.id} style={styles.cards__container}>
                  <TouchableHighlight onPress={() => HandleShow(card.id)}>
                    <View style={styles.card__container}>
                      <Image source={{ uri: card.img }} style={styles.card} />
                    </View>
                  </TouchableHighlight>
                  <View style={styles.info__container}>
                    <Text>ID: {card.id}</Text>
                    <Text>Nombre: {card.name}</Text>
                    <Text>Cantidad: {card.cantidad}</Text>
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
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    height: "90%",
  },
  preview: {
    width: "100%",
    height: 200,
    position: "relative",
    alignItems: "start",
    backgroundColor: "#d1d1d1",
    padding: 10,
    flexDirection: "row",
  },
  preview__text: {
    gap: 8,
    marginLeft: 20,
    justifyContent: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
  image: {
    width: "100%",
    height: 400,
  },
  card: {
    width: 60,
    height: 90,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: "4%",
    flexWrap: "wrap",
    flexDirection: "row",
    width: 400,
    gap: 15,
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  cards__container:{
    width: 400,
    flexDirection: "row"
  },
  card__container: {
    width: 60,
    flexDirection: "row",
    justifyContent: "start",
  },
  info__container: {
    gap: 5,
    justifyContent: "center",
    marginLeft: 20,
  },
});

export default ViewCards;
