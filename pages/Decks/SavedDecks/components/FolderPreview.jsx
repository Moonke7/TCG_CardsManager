import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";

const FolderPreviewAlert = ({
  visible,
  onCancel,
  CardsLeft,
  FolderData,
  UseCard,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.cardsLeft__container}>
            <Text>Cartas buscadas:</Text>
            {CardsLeft.length > 0 ? (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {CardsLeft.map((card, index) => (
                  <ImageBackground
                    key={index}
                    source={{ uri: card.imgURL }}
                    style={styles.card}
                  >
                    <Text style={styles.cantidad}>{card.cantidad}</Text>
                  </ImageBackground>
                ))}
              </ScrollView>
            ) : (
              <Text> Agregaste todas las cartas que necesitabas </Text>
            )}
          </View>
          <View style={styles.cardsInFolder__container}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={{ fontSize: 15 }}>Cartas buscadas en: </Text>
              <Text style={{ color: "#0616cd", fontWeight: "bold" }}>
                {FolderData.name}
              </Text> 
            </View>
            {FolderData ? (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {FolderData.cards.map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => UseCard(card.id)}
                  >
                    <ImageBackground
                      source={{ uri: card.img }}
                      style={styles.card}
                    >
                      <Text style={styles.cantidad}>{card.cantidad}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text> No hay mas cartas que busques en esta carpeta </Text>
            )}
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
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    padding: 8,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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
  cardsLeft__container: {
    height: 150,
    width: "100%",
    paddingBottom: 10,
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
  },
  card: {
    width: 45,
    height: 80,
  },
  cantidad: {
    position: "absolute",
    backgroundColor: "black",
    width: 15,
    height: 15,
    borderRadius: 15,
    color: "white",
    top: 0,
    right: -2,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
  },
  cardsInFolder__container: {
    height: 200,
    width: "100%",
    paddingBottom: 10,
  },
});

export default FolderPreviewAlert;
