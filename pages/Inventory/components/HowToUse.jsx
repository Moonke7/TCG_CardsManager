import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const HowToUse = ({ visible, onCancel }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={onCancel}
            style={{ position: "absolute", top: 15, left: 15 }}
          >
            <Ionicons name="close" size={32} color="black" />
          </TouchableOpacity>
          <Text style={styles.tittle}>¿Como guardar cartas?</Text>
          <View style={styles.InfoContainer}>
            <Image
              source={{
                uri: "https://cdn.discordapp.com/attachments/871584163025805322/1270142699261005904/image.png?ex=66b2a011&is=66b14e91&hm=1822ec127e69c1cd03f1090dba0d42ab2ec5e46ed27fedd8096695044d2aafb6&",
              }}
              style={styles.firstImage}
            />
            <Text style={{width: "45%"}}>
              1- Al presionar una carta se abrira una pestaña en la cual se pueden
              ver todos los detalles de la carta. Aqui seleccionaras la cantidad
              que desees agregar y presionas "Añadir", este boton añadira tu
              carta a un almacenamiento temporal
            </Text>
          </View>
          <View style={styles.InfoContainer}>
            <Image
              source={{
                uri: "https://cdn.discordapp.com/attachments/871584163025805322/1270149619719995463/image.png?ex=66b2a683&is=66b15503&hm=2e003d0de41c483784cc5fb4343d5184377653af5477ed177dbd57b575808817&",
              }}
              style={{ width: "50%", height: 160 }}
            />
            <Text style={{width: "45%"}}>
              2- Puedes ver las cartas añadidas a este almacenamiento presionando
              en "Ver cartas"
            </Text>
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
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    height: "90%",
  },
  tittle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  firstImage: {
    width: "50%",
    height: 300,
  },
  InfoContainer: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingVertical: 10
  },
});

export default HowToUse;
