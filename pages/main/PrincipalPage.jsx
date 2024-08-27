import React, { useContext } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Menu from "./components/Menu";
import { GlobalContext } from "../../GlobalContext";
import Header from "./components/Header";

const PrincipalPage = () => {
  const navigation = useNavigation();
  const { username } = useContext(GlobalContext);

  const GoToInvetary = () => {
    navigation.navigate("Inventory");
  };
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/736x/32/5d/e2/325de227b1f0e68dd5e6d3a9f1c3b7b3.jpg",
        }}
        resizeMode="cover"
        style={styles.background}
      >
        <Header />
        <Text style={{position: "absolute", bottom: 0, right: 0, backgroundColor: "#f6f6f6", opacity: .5, paddingHorizontal: 25}}>Developed by: Moonke7</Text>
        <View style={styles.container}>
          <Text style={styles.tittle}> Bienvenido/a {username ? username: "cargando datos.."} </Text>
          <Menu user={username}/>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "start",
    height: 650,
  },
  tittle: {
    marginBottom: 50,
    color: "#363636",
    fontSize: 45,
    width: "85%",
    alignSelf: "center",
  },
});
export default PrincipalPage;
