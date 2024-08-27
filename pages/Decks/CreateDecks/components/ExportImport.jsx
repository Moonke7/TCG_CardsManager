import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { combinedData } from "../../../../database/Cards/combinedData";

const ExportImportAlert = ({
  visible,
  onCancel,
  ExportCards,
  togleAlert,
  setCardsAdded,
  limitations
}) => {
  const [text, setText] = useState("");
  const updateText = (e) => {
    setText(e);
  };

  const ImportCards = () => {
    let idsArray = text.split(",\n");
    
    //comprobar que las limitaciones sean iguales y eliminar esta parte de texto:
    console.log(idsArray[0].slice(15) === limitations)
    console.log(limitations)
    const limitation = idsArray[0].slice(15)
    if(limitation !== `${limitations}`){
      Alert.alert("Estos mazos tienen diferentes reglas")
      return
    }
    let newIdsArray = idsArray.slice(1)
    //una vez dividido el array, lo recorremos
    setCardsAdded([])
    let arr = [];
    newIdsArray.forEach((id) => {
      const RealId = id.slice(0, -3);
      const CardExist = arr.findIndex((card) => card.id == RealId);
      const card = combinedData.find((card) => card.id === id);

      if (CardExist !== -1) {
        arr[CardExist].cards = [...arr[CardExist].cards, card];
      } else {
        // Si no existe, se crea un nuevo objeto y se añade a arr
        const cardsArr = [card];
        const obj = {
          id: RealId,
          cards: cardsArr,
        };
        arr.push(obj); // Aquí se añade el objeto al array
      }
    });
    setCardsAdded(arr);
    setText("")
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
          <TouchableOpacity onPress={togleAlert} style={styles.close}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: "bold", color: "red", width: 50 }}>
              Nota:
            </Text>
            <Text>
              Para importar cartas deben ser exportadas por otro usuario o por
              ti mismo desde esta misma aplicacion
            </Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={updateText}
            value={text}
            placeholder="Cartas a importar "
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={ImportCards}>
              <Text style={styles.buttonText}>Importar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={ExportCards}>
              <Text style={styles.buttonText}>Exportar</Text>
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
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  options__container: {
    gap: 15,
    marginBottom: 15,
  },
  saveButton: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  input: {
    borderColor: "#292929",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 20,
    fontSize: 14,
    backgroundColor: "#e7e7e7",
    color: "#292929",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default ExportImportAlert;
