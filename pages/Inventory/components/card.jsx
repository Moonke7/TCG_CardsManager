import { View, Text, StyleSheet } from "react-native";

const Card = ({ card }) => {
  return (
    <View style={[styles.card, styles[`card__${card.color}`]]}>
      <Text style={{ fontSize: 13, fontWeight: "400" }}>{card.categoria}</Text>
      <Text style={{ fontSize: 10, fontWeight: "350" }}>{card.nombre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card__: {
    height: 50,
    width: 20,
  },
  card__red: {
    height: 85,
    width: 55,
    backgroundColor: "#be1717",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.95,
    borderColor: "#141414",
    borderWidth: 1,
    borderRadius: 4,
  },
  card__green: {
    height: 50,
    width: 20,
    backgroundColor: "#167f4e",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.95,
    borderColor: "#141414",
    borderWidth: 1,
    borderRadius: 4,
  },
  card__blue: {
    height: 50,
    width: 20,
    backgroundColor: "#195fa9",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.95,
    borderColor: "#141414",
    borderWidth: 1,
    borderRadius: 4,
  },
  card__purple: {
    height: 50,
    width: 20,
    backgroundColor: "#a91995",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.95,
    borderColor: "#141414",
    borderWidth: 1,
    borderRadius: 4,
  },
  card__black: {
    height: 50,
    width: 20,
    backgroundColor: "#3d3d3d",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.95,
    borderColor: "#141414",
    borderWidth: 1,
    borderRadius: 4,
  },
  card__yellow: {
    height: 50,
    width: 20,
    backgroundColor: "#dce926",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.95,
    borderColor: "#141414",
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default Card;
