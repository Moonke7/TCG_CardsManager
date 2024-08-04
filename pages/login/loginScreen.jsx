import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app, auth } from "../../database/firebase";
import { GlobalContext } from "../../GlobalContext";

const LoginScreen = () => {
  const db = getFirestore(app);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState("eye");
  const [showPassword, setShowPassword] = useState(true);
  const { setUserId, setUsername } = useContext(GlobalContext);

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

  const SignIn = async () => {
    try {
      let email = user;
      const q = query(collection(db, "users"), where("username", "==", user));
      const querySnapshot = await getDocs(q);
      if (!user.includes("@")) {
        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email;
        } else {
          throw new Error("No user found with this username");
        }
      }

      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Sesion iniciada!");
      setUserId(querySnapshot.docs[0].data().uid);
      setUsername(user);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert(error.message);
    }
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
      <ImageBackground
        source={{
          uri: "https://mrwallpaper.com/images/thumbnail/one-piece-phone-straw-hat-pirates-silhouettes-w159zozl47swnokd.webp",
        }}
        resizeMode="cover"
        style={styles.fondo}
      >
        <View style={styles.inputsContainer} blurType="light" blurAmount={10}>
          <Text style={{ fontSize: 25, marginBottom: 10, color: "#3c151b" }}>
            Iniciar sesion
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={userUpdate}
            value={user}
            placeholder="Username / email"
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
          <TouchableOpacity onPress={SignIn} style={styles.boton}>
            <Text style={styles.normalText}>Ingresar</Text>
          </TouchableOpacity>
          <View style={styles.createContainer}>
            <Text style={styles.normalText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.create}>crear cuenta</Text>
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

export default LoginScreen;
