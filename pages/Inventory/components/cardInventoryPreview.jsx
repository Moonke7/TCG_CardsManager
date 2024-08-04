import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";


const CardPreviewInventory = ({
  visible,
  onConfirm,
  onCancel,
  message,
  imgSrc,
  selectedCard,
}) => {
  const [arrow, setArrow] = useState("down");
  const togleHide = () => {
    arrow == "down" ? setArrow("left") : setArrow("down");
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
          <Image source={{ uri: imgSrc }} style={styles.image} />
          <View style={styles.details__container}>
            <View>
              <TouchableOpacity style={styles.details__button} onPress={togleHide}>
                <Text style={{ color: "#454545" }}>Detalles de la carta</Text>
                <AntDesign name={arrow} size={16} color="#454545" />
              </TouchableOpacity>
            </View>
            <View style={arrow == "left" ? styles.details__text__container__show : styles.details__text__container__hide}>
              <Text style={styles.details__text}>ID: {selectedCard.id}</Text>
              <Text style={styles.details__text}>
                Nombre: {selectedCard.name}
              </Text>
              <Text style={styles.details__text}>
                Color: {selectedCard.color}
              </Text>
              <Text style={styles.details__text}>
                Poder: {selectedCard.power}
              </Text>
              <Text style={styles.details__text}>
                Categoria: {selectedCard.category}
              </Text>
              <Text style={styles.details__text}>
                Tipo: {selectedCard.type}
              </Text>
              <Text style={styles.details__text}>
                Coste: {selectedCard.cost}
              </Text>
              <Text style={styles.details__text}>
                Atributo: {selectedCard.atribbute}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Cerrar</Text>
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
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  message: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
  image: {
    width: "100%",
    height: 400,
  },
  details__container: {
    width: "100%",
  },
  details__button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
    marginBottom: 10
  },
  details__text__container__show: {
    height: 100,
    flexWrap: "wrap",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
  },
  details__text__container__hide: {
    position: "absolute",
    opacity: 0,
    left: -1000,
  },
  details__text: {
    width: "50%",
    fontSize: 12,
    color: "#5d5d5d",
  },
});

export default CardPreviewInventory;
