import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../GlobalContext";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FolderPreviewAlert from "./FolderPreview";
import AntDesign from "@expo/vector-icons/AntDesign";
import SaveAlert from "./SaveAlert";

const SearchCards = () => {
  const { Folders, searchedCards, setFolders } = useContext(GlobalContext);
  const [folderPreview, setFolderPreview] = useState(false);
  const [SaveChanges, setSaveChanges] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [usedCards, setUsedCards] = useState([]);
  const [CardsLeft, setCardsLeft] = useState([]);

  useEffect(() => {
    const LoadCards = () => {
      const uniqueCards = [];

      searchedCards.forEach((group) => {
        group.cards.forEach((card) => {
          // Busca si la carta ya existe en el arreglo uniqueCards
          const existingCard = uniqueCards.find(
            (uniqueCard) => uniqueCard.id === card.id
          );

          if (existingCard) {
            // Si ya existe, incrementa la cantidad
            existingCard.cantidad += 1;
          } else {
            // Si no existe, agrega la carta con cantidad 1
            uniqueCards.push({ ...card, cantidad: 1 });
          }
        });
      });

      setCardsLeft(uniqueCards); // Actualiza el estado con las cartas únicas
    };
    LoadCards();
  }, []);

  const toggleFolderPreview = () => setFolderPreview(!folderPreview);
  const toggleSaveAlert = () => setSaveChanges(!SaveChanges);

  const SelectFolder = (index) => {
    setSelectedFolder(Folders[index]);
    setFolderPreview(true);
  };

  const UpdateLeftCards = (id) => {
    const cardIndex = CardsLeft.findIndex((card) => card.id === id);
    //si es que encuentra la carta aplica la siguiente logica
    if (cardIndex !== -1) {
      let newData = [...CardsLeft];
      const card = newData[cardIndex];
      //veririfica que haya mas de una para reducir su cantidad, caso contrario, la elimina
      if (newData[cardIndex].cantidad > 1) {
        newData[cardIndex].cantidad = newData[cardIndex].cantidad - 1;
      } else {
        newData = newData.filter((card) => card.id !== id);
      }
      setCardsLeft(newData);

      //crea el arreglo con las cartas añadidas, referenciando su nombre e id
      const cardInFolderIndex = selectedFolder.cards.findIndex(
        (card) => card.id === id
      );
      let newFolderData = [...selectedFolder.cards];
      if (newFolderData[cardInFolderIndex].cantidad > 1) {
        newFolderData[cardInFolderIndex].cantidad =
          newFolderData[cardInFolderIndex].cantidad - 1;
      } else {
        newFolderData = newFolderData.filter((card) => card.id !== id);
      }
      selectedFolder.cards = newFolderData;

      const usedArray = [...usedCards];
      const exist = usedArray.find(
        (folder) => folder.name === selectedFolder.name
      );

      if (exist) {
        const cardExist = exist.cards.find((card) => card.id === id);
        if (cardExist) {
          cardExist.cantidad = cardExist.cantidad + 1;
        } else {
          card.cantidad = 1;
          exist.cards.push({ ...card });
        }
      } else {
        const newFolderEntry = {
          name: selectedFolder.name,
          id: selectedFolder.id,
          cards: [{ ...card, cantidad: 1 }],
        };
        usedArray.push(newFolderEntry);
      }
      setUsedCards(usedArray);
    }
  };

  const navigation = useNavigation();
  const goBack = () => {
    setFolders([]);
    navigation.navigate("CreateDeck");
  };

  return (
    <View style={styles.container}>
      <View style={styles.goBack}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.tittle}>Las cartas que buscas estan en:</Text>
        <TouchableOpacity style={styles.SaveButton} onPress={toggleSaveAlert}>
          <Text>Guardar</Text>
          <AntDesign name="save" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {Folders.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {Folders.map((folder, index) => (
            <View style={styles.folderContainer} key={index}>
              <TouchableOpacity onPress={() => SelectFolder(index)}>
                <Text style={styles.folderName}>{folder.name}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: "row", gap: 15, alignItems: "center"}}>
                <Text style={styles.aviso}>
                  {folder.cards.length === CardsLeft.length
                    ? "Todas las cartas estan aqui!"
                    : ""}
                </Text>
                <Text style={styles.cantidad}>{folder.cards.length}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text> No tienes ninguna carta de este mazo </Text>
      )}

      <FolderPreviewAlert
        visible={folderPreview}
        onCancel={toggleFolderPreview}
        FolderData={selectedFolder ? selectedFolder : ""}
        CardsLeft={CardsLeft}
        UseCard={UpdateLeftCards}
      />
      <SaveAlert
        visible={SaveChanges}
        onCancel={toggleSaveAlert}
        message={"¿Estas seguro de realizar estos cambios?"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: "center",
  },
  folderContainer: {
    width: "98%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderTopColor: "black",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    borderTopWidth: 0.3,
    paddingVertical: 8,
  },
  tittle: {
    fontSize: 30,
    fontWeight: "bold",
    width: "100%",
  },
  infoContainer: {
    width: "80%",
    marginBottom: 5,
    gap: 15,
  },
  goBack: {
    position: "absolute",
    left: 15,
    top: 35,
  },
  scrollContent: {
    flexGrow: 1,
    paddingLeft: "4%",
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
  },
  folderName: {
    fontWeight: "500",
    color: "#283543",
    fontSize: 17,
  },
  cantidad: {
    fontWeight: "bold",
    color: "#0616cd",
    fontSize: 15,
  },
  SaveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  aviso: {
    fontWeight: "800",
    color: "#009f63"
  }
});
export default SearchCards;
