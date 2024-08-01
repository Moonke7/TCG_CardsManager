import { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { app } from "../../../database/firebase";
import { getFirestore, setDoc, collection, doc } from "firebase/firestore";

const AddFolder = () => {
  const [name, setName] = useState("");

  const NameUpdate = (e) => {
    setName(e);
    console.log(e);
  };

  const navigation = useNavigation();

  const GoToInventory = () => {
    navigation.navigate("Inventory");
  };

  const db = getFirestore(app);
  const addFolderToUser = async () => {
    const folderName = name
    if (folderName != "") {
      try {
        const userFoldersCollection = collection(db, `folders`);
        const newFolderRef = doc(userFoldersCollection);

        await setDoc(newFolderRef, {
          name: folderName,
        });

        GoToInventory();
        console.log("Folder added successfully!");
      } catch (error) {
        Alert.alert("ERROR: " + error);
      }
    }
  };
  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/05/30/08/053008e96e6929f75ab889ec21a3f074.jpg",
      }}
      style={styles.image}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={NameUpdate}
          value={name}
          placeholder="Nombre de la carpeta"
        />
        <TouchableOpacity style={styles.text} onPress={addFolderToUser}>
          <Text style={{ fontSize: 13, color: "#464646" }}>Crear carpeta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={GoToInventory}>
          <AntDesign name="closecircleo" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#7c7c7c",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "60%",
    marginVertical: 8,
    fontSize: 17,
    backgroundColor: "#bdbdbd",
    color: "#292929",
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 260,
    gap: 15,
    backgroundColor: "#ededed",
    opacity: 0.85,
    height: "100%",
  },
  text: {
    borderColor: "#7c7c7c",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    width: "50%",
    alignItems: "center",
    backgroundColor: "#dcdcdc",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  close: {
    position: "absolute",
    right: 20,
    top: 40,
  },
});

export default AddFolder;
