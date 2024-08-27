import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

const ChangeName = ({ visible, onConfirm, onCancel, message }) => {
  const [name, setName] = useState("");
  const updateName = (e) => {
    setName(e);
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
          <TextInput
            style={styles.input}
            onChangeText={updateName}
            value={name}
            placeholder="Ingresar nombre"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onConfirm(name)}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
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
    fontWeight: "700",
  },
  input: {
    borderColor: "#292929",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 28,
    fontSize: 14,
    backgroundColor: "#e7e7e7",
    color: "#292929",
  },
});

export default ChangeName;
