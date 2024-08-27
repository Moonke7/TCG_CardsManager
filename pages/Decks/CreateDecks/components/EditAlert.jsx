import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { combinedData } from "../../../../database/Cards/combinedData";

const EditAlert = ({
  visible,
  setCardsAdded,
  onCancel,
  diseños,
  data,
  cardsAdded,
  setData,
  setcontador,
}) => {
  const [ShowDesign, setShowDesign] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const HandleShowDesign = () => {
    setShowDesign(!ShowDesign);
  };

  const ToggleSelected = (index, id) => {
    setSelectedCardIndex(index === selectedCardIndex ? null : index);
    setSelectedCardId(id);
  };

  const ChangeImg = (cardToReplace, newDesignIndex) => {
    const realId = selectedCardId;
    const AllCards = combinedData.filter((card) => card.RealId === realId);
    if (AllCards.length <= newDesignIndex) {
      console.error("El índice de la nueva carta es inválido");
      return;
    }
    const CardGroupIndex = cardsAdded.findIndex((car) => car.id === realId);
    if (CardGroupIndex === -1) {
      console.error(
        "No se encontró un grupo de cartas con el RealId especificado en cardsAdded"
      );
      return;
    }
    if (cardsAdded[CardGroupIndex].cards.length <= cardToReplace) {
      console.error("El índice de la carta a reemplazar es inválido");
      return;
    }
    const newCardsAdded = [...cardsAdded];

    newCardsAdded[CardGroupIndex].cards[cardToReplace] =
      AllCards[newDesignIndex];
    setCardsAdded(newCardsAdded);
    setSelectedCardIndex(null)
  };

  const DeleteItem = () => {
    const realId = selectedCardId;
    const CardGroupIndex = cardsAdded.findIndex((car) => car.id === realId);

    if (CardGroupIndex === -1) {
      console.error(
        "No se encontró un grupo de cartas con el RealId especificado en cardsAdded"
      );
      return;
    }

    const newCardsAdded = [...cardsAdded];
    newCardsAdded[CardGroupIndex].cards = newCardsAdded[
      CardGroupIndex
    ].cards.filter((card, index) => index !== selectedCardIndex);

    setCardsAdded(newCardsAdded);
    setData(cardsAdded[CardGroupIndex].cards)
    setSelectedCardIndex(null)
    setcontador((prevCount) => prevCount - 1)
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
          <View style={styles.cards__container}>
            <Text
              style={{
                alignSelf: "center",
                fontWeight: "700",
                fontSize: 20,
                marginBottom: 15,
              }}
            >
              Editar cartas
            </Text>
            {data ? (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {data.map((card, index) => {
                  const isSelected = index === selectedCardIndex;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => ToggleSelected(index, card.RealId)}
                      style={isSelected && styles.cardSelected}
                    >
                      <ImageBackground
                        source={{ uri: card.imgURL }} // Asegúrate de que estás utilizando el nombre de propiedad correcto, aquí imgURL
                        style={styles.card}
                      />
                    </TouchableOpacity>
                  );
                })}
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
          <View style={styles.buttons__container}>
            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                onPress={HandleShowDesign}
              >
                <Text>Cambiar diseño</Text>
                <AntDesign
                  name={ShowDesign ? "up" : "down"}
                  size={18}
                  color="black"
                />
              </TouchableOpacity>
              {diseños ? (
                <View
                  style={[
                    styles.DesignCards__container,
                    ShowDesign
                      ? ""
                      : { opacity: 0, position: "absolute", left: -1000 },
                  ]}
                >
                  {diseños.map((cardDesign, index) => {
                    return (
                      <TouchableOpacity
                        key={cardDesign.id}
                        onPress={() => ChangeImg(selectedCardIndex, index)}
                      >
                        <ImageBackground
                          source={{ uri: cardDesign.imgURL }}
                          style={styles.cardDesgn}
                        />
                      </TouchableOpacity>
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
            <TouchableOpacity
              style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
              onPress={DeleteItem}
            >
              <Text>Eliminar</Text>
              <AntDesign name="close" size={18} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Guardar y cerrar</Text>
            </TouchableOpacity>
          </View>
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
    padding: 10,
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  buttons__container: {
    marginVertical: 15,
    gap: 15,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingLeft: 0,
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    gap: 8,
    alignSelf: "center",
  },
  cards__container: {
    height: 180,
    width: "100%",
  },
  card: {
    width: 75,
    height: 110,
    backgroundColor: "black",
  },
  cardDesgn: {
    width: 50,
    height: 75,
    backgroundColor: "gray",
  },
  DesignCards__container: {
    width: "100%",
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "blue",
    backgroundColor: "#d3d3d3",
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 2,
  },
});

export default EditAlert;
