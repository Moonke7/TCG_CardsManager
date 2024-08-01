import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Entypo from "@expo/vector-icons/Entypo";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app, auth } from "../../database/firebase";

const db = getFirestore(app);



const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState("eye");
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    const setDefault = () => {
      setUser("");
      setPassword("");
    };

    setDefault();
  }, []);

  const handleShow = () => {
    eye == "eye" ? setEye("eye-with-line") : setEye("eye");
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const createUser = () => {
    createUserWithEmailAndPassword(auth, user, password)
      .then((UserCredential) => {
        const user = UserCredential.user;

        setDoc(doc(db, "users", user.uid), {
          username: username,
          email: user.email,
        });
      })
      .then(() => {
        Alert.alert("Account created!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };

  const usernameUpdate = (e) => {
    setUsername(e);
  };
  const userUpdate = (e) => {
    setUser(e);
  };
  const PasswordUpdate = (e) => {
    setPassword(e);
  };


  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={{uri: "https://mrwallpaper.com/images/thumbnail/one-piece-phone-straw-hat-pirates-silhouettes-w159zozl47swnokd.webp"}} resizeMode="cover" style={styles.fondo}>
        <View style={styles.inputsContainer} blurType="light" blurAmount={10}>
          <Text style={{ fontSize: 25, marginBottom: 10, color: "#3c151b" }}>
            Crear cuenta
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={usernameUpdate}
            value={username}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            onChangeText={userUpdate}
            value={user}
            placeholder="Email"
          />
          <View style={styles.input}>
            <TextInput
              onChangeText={PasswordUpdate}
              value={password}
              placeholder="Password"
              secureTextEntry={showPassword}
            />
            <TouchableOpacity style={styles.eye} onPress={handleShow}>
              <Entypo name={eye} size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={createUser} style={styles.boton}>
            <Text style={styles.normalText}>Ingresar</Text>
          </TouchableOpacity>
          <View style={styles.createContainer}>
            <Text style={styles.normalText}>¿Tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.create}>iniciar sesion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  normalText: {
    color: "#3c151b",
  },
  h1Text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3c151b",
  },
  input: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 8,
  },
  inputsContainer: {
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#fcf4f4",
    padding: 20,
    borderRadius: 15,
  },
  boton: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 8,
    alignItems: "center",
  },
  createContainer: {
    flexDirection: "row",
    gap: 5,
  },
  create: {
    color: "#cc676a",
  },
  eye: {
    position: "absolute",
    bottom: 7,
    right: 7,
  },
});

export default CreateAccount;
