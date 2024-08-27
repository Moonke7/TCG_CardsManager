import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator, // Para mostrar un indicador de carga
} from "react-native";
import { app } from "../../../../database/firebase";
import { GlobalContext } from "../../../../GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const SaveOptionsAlert = ({ visible, onCancel, AddedCards, togleAlert }) => {
  const { userId, deckId, deckName, AddFolderToSearchCards, setSearchedCards } =
    useContext(GlobalContext);
  const [SavingSnack, setSavingSnack] = useState(false);
  const [SavedSnack, setSavedSnack] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controlar el loading
  const navigation = useNavigation();

  const toggleSaving = () => setSavingSnack(!SavingSnack);
  const dismissSaving = () => setSavingSnack(false);
  const toggleSaved = () => setSavedSnack(!SavedSnack);

  const goToFolders = () => {
    navigation.navigate("Inventory");
  };
  const goToSearchCards = () => {
    navigation.navigate("SearchCards");
  };

  const db = getFirestore(app);

  const SaveAddedCards = async () => {
    setLoading(true);
    try {
      toggleSaving();
      const CardsToSaveCollection = collection(
        db,
        `users/${userId}/decks/${deckId}/cards`
      );

      const snapshot = await getDocs(CardsToSaveCollection);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      for (const group of AddedCards) {
        for (const card of group.cards) {
          await addDoc(CardsToSaveCollection, {
            name: card.name,
            id: card.id,
            RealId: card.RealId,
            power: card.power,
            category: card.category,
            type: card.type,
            cost: card.cost,
            attribute: card.atribbute, // Corregido
            effect: card.effect,
            img: card.imgURL,
          });
        }
      }

      dismissSaving();
      toggleSaved();
      console.log("Todas las cartas han sido guardadas exitosamente.");
    } catch (error) {
      console.log("ERROR: " + error);
    } finally {
      setLoading(false);
    }
  };

  const transferCardsToFolder = async () => {
    const folderName = deckName;
    
    if (folderName !== "") {
      try {
        await SaveAddedCards();
        setLoading(true);
        const userFoldersCollection = collection(db, `users/${userId}/folders`);
        const nameQuery = query(
          userFoldersCollection,
          where("name", "==", folderName)
        );
        const querySnapshotName = await getDocs(nameQuery);

        let folderId;

        if (!querySnapshotName.empty) {
          folderId = querySnapshotName.docs[0].id;
        } else {
          const newFolderRef = doc(userFoldersCollection);
          await setDoc(newFolderRef, { name: folderName });
          folderId = newFolderRef.id;
        }

        const recentAddedCollection = collection(
          db,
          `users/${userId}/decks/${deckId}/cards`
        );
        const cardsCollection = collection(
          db,
          `users/${userId}/folders/${folderId}/cards`
        );

        const querySnapshot = await getDocs(recentAddedCollection);

        for (const cardDoc of querySnapshot.docs) {
          const cardData = cardDoc.data();
          const cardQuantity = cardData.cantidad || 1;

          const cardQuery = query(
            cardsCollection,
            where("id", "==", cardData.id)
          );
          const cardQuerySnapshot = await getDocs(cardQuery);

          if (!cardQuerySnapshot.empty) {
            const existingCardDoc = cardQuerySnapshot.docs[0];
            const existingCardData = existingCardDoc.data();
            const newCantidad = existingCardData.cantidad + cardQuantity;
            await updateDoc(existingCardDoc.ref, { cantidad: newCantidad });
          } else {
            const newCardRef = doc(cardsCollection);
            await setDoc(newCardRef, {
              ...cardData,
              cantidad: cardQuantity,
            });
          }

          await deleteDoc(cardDoc.ref);
        }
        goToFolders();
      } catch (error) {
        console.error("Error transferring cards: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Folder name is empty!");
    }
  };

  const LookInInventory = async () => {
    if (AddedCards) {
      try {
        await SaveAddedCards();
        setLoading(true);
        const userFoldersCollection = collection(db, `users/${userId}/folders`);
        const FoldersQuerySnapshot = await getDocs(userFoldersCollection);

        await Promise.all(
          FoldersQuerySnapshot.docs.map(async (folder) => {
            const folderData = folder.data();
            const folderName = folderData.name;
            const FolderId = folder.id;

            const CardsFromFolderCollection = collection(
              db,
              `users/${userId}/folders/${FolderId}/cards`
            );
            const CardsFromFolderQuery = await getDocs(
              CardsFromFolderCollection
            );

            let foundCardCount = 0;
            const CardsFound = [];

            CardsFromFolderQuery.forEach((card) => {
              const cardData = card.data();
              const id = cardData.RealId;

              const SearchedCard = AddedCards.find((c) => c.id === id);

              if (SearchedCard) {
                foundCardCount += 1;
                CardsFound.push(cardData);
              }
            });

            if (foundCardCount > 0) {
              const FolderObject = {
                name: folderName,
                id: FolderId,
                cantidad: foundCardCount,
                cards: CardsFound,
              };

              AddFolderToSearchCards(FolderObject);
              setSearchedCards(AddedCards);
              togleAlert();
            }
          })
        );

        goToSearchCards();
      } catch (error) {
        console.error("Error buscando en el inventario:", error);
      } finally {
        setLoading(false);
      }
    }
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
          <View style={styles.options__container}>
            <TouchableOpacity
              onPress={SaveAddedCards}
              style={styles.saveButton}
              disabled={loading} // Deshabilitar mientras loading es true
            >
              <Text>Guardar y salir</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <AntDesign name="save" size={24} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={transferCardsToFolder}
              style={styles.saveButton}
              disabled={loading} // Deshabilitar mientras loading es true
            >
              <Text>Añadir mazo como nuevo almacen</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <MaterialIcons name="data-saver-on" size={24} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={LookInInventory}
              style={styles.saveButton}
              disabled={loading} // Deshabilitar mientras loading es true
            >
              <Text>Buscar cartas en tu inventario</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <MaterialIcons name="manage-search" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onCancel}
              disabled={loading} // Deshabilitar mientras loading es true
            >
              <Text style={styles.buttonText}>cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Snackbar
          visible={SavingSnack}
          style={{ width: "90%", alignSelf: "center" }}
          onDismiss={dismissSaving}
          action={{
            label: "close",
            onPress: () => {
              dismissSaving();
            },
          }}
        >
          Guardando cartas...
        </Snackbar>
        <Snackbar
          style={{ width: "90%", alignSelf: "center" }}
          visible={SavedSnack}
          onDismiss={toggleSaved}
          action={{
            label: "close",
            onPress: () => {
              toggleSaved();
            },
          }}
        >
          Todas las cartas han sido guardadas exitosamente.
        </Snackbar>
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
    justifyContent: "center",
    width: "100%",
  },
  button: {
    padding: 7,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
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
});

export default SaveOptionsAlert;
