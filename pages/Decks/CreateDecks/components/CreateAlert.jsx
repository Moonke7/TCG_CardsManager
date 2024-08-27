import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

const CreateDeckAlert = ({ visible, onConfirm, onCancel, message }) => {
  const [name, setName] = useState("");

  const UpdateName = (e) =>{
    setName(e);
  }
  
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>
          <TextInput
            style={styles.input}
            onChangeText={UpdateName}
            value={name}
            placeholder="Nombre"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onConfirm(name)}>
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
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 5,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  input:{
    borderColor: "#7c7c7c",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: "60%",
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "#bdbdbd",
    color: "#292929",
  }
});

export default CreateDeckAlert;
