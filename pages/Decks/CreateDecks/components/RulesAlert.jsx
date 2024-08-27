import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const RulesAlert = ({ visible, onConfirm, onCancel, message }) => {
  const [infoShow, setInfoShow] = useState(false);
  const handleShow = () =>{setInfoShow(!infoShow)}

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={{width: "100%"}}>
            <TouchableOpacity onPress={handleShow} style={{position: "absolute", top: 0, right: 0, zIndex: 100}}>
              <Feather name="info" size={24} color="black" />
            </TouchableOpacity>
            <Text style={infoShow ? styles.info__show : styles.info__hide}>
              Al escoger "con limitaciones" se refiere a que podras armar tu
              mazo basado en las reglas de el juego, es decir, podras elegir un
              solo lider, max 51 cartas, etc. Sin limitaciones podras escoger
              tantas cartas quieras para tu mazo
            </Text>
          </View>

          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Con limitaciones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>Sin limitaciones</Text>
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
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  info__hide: {
    position: "absolute",
    opacity: 0,
    left: -1000,
  },
  info__show: {
    paddingTop: 25,
    fontWeight: "700"
  },
});

export default RulesAlert;
