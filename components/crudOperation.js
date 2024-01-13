import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { IconButton } from "react-native-paper";

export default function CrudOperation() {
  const [movies, setMovies] = useState([]);
  const [movieEdit, setMovieEdit] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalMovie, setModalMovie] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [viewMovieDetails, setViewMovieDetails] = useState(null);

  useEffect(() => {
    getlistMovies();
  }, []);

  const getlistMovies = () => {
    fetch("https://reactnative.dev/movies.json", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.movies) {
          setMovies(res.movies);
        }
        setIsLoading(false);
        console.log(res);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleDeleteMovies = (moviesId) => {
    const updatedMovies = movies.filter((movie) => movie.id !== moviesId);
    setMovies(updatedMovies);
  };

  const handleCreate = () => {
    setModalMovie(true);
  };

  const handleCloseModal = () => {
    setModalMovie(false);
  };

  const handleSave = () => {
    if (movieName === "" || releaseYear === "") {
      return;
    }

    const newMovie = {
      id: Date.now().toString(),
      title: movieName,
      releaseYear: releaseYear,
    };

    const existingMovieIndex = movies.findIndex(
      (movie) => movie.title === movieEdit
    );

    if (existingMovieIndex !== -1) {
      const updatedMovies = [...movies];
      updatedMovies[existingMovieIndex] = {
        ...updatedMovies[existingMovieIndex],
        title: movieName,
        releaseYear: releaseYear,
      };

      setMovies(updatedMovies);
    } else {
      const updatedMovies = [...movies, newMovie];
      setMovies(updatedMovies);
    }

    setMovieName("");
    setReleaseYear("");
    setModalMovie(false);
    setMovieEdit("");
  };

  const handleEdit = (item) => {
    setMovieName(item.title);
    setReleaseYear(item.releaseYear);
    setMovieEdit(item.title);
    setModalMovie(true);
  };

  const handleView = (item) => {
    setViewMovieDetails(item);
  };

  const handleCloseDetailsModal = () => {
    setViewMovieDetails(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={modalMovie}>
        <SafeAreaView style={styles.content}>
          <View style={styles.addmovietittle}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginVertical: 10,
                color: "#909E84",
              }}
            >
              Add New Movie
            </Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={{ fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ marginTop: 15 }}>Movie Name:</Text>
            <TextInput
              style={styles.textinput}
              placeholder=""
              value={movieName}
              onChangeText={(text) => setMovieName(text)}
            />
            <Text style={{ marginTop: 15 }}>releaseYear:</Text>
            <TextInput
              style={styles.textinput}
              placeholder=""
              value={releaseYear}
              onChangeText={(text) => setReleaseYear(text)}
            />
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: "#909E84",
                borderRadius: 35,
                paddingHorizontal: 20,
                color: "white",
                marginVertical: 15,
                fontWeight: "bold",
              }}
              onPress={handleSave}
            >
              SAVE
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#909E84" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.rowBetween}>
            <Text style={styles.txtMain}>Movies List: {movies.length}</Text>
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: "#909E84",
                borderRadius: 35,
                paddingHorizontal: 20,
              }}
              onPress={handleCreate}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>NEW</Text>
            </TouchableOpacity>
          </View>
          {movies.map((movie, index) => (
            <View style={styles.oneuser} key={index}>
              <View style={styles.data}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.title}>{movie.releaseYear}</Text>
              </View>
              <View style={styles.icons}>
                <IconButton
                  icon="pencil"
                  iconColor="black"
                  size={18}
                  onPress={() => handleEdit(movie)}
                />

                <IconButton
                  icon="trash-can"
                  iconColor="black"
                  size={18}
                  onPress={() => handleDeleteMovies(movie.id)}
                />
                <IconButton
                  icon="eye"
                  iconColor="black"
                  size={18}
                  onPress={() => handleView(movie)}
                />
              </View>
            </View>
          ))}
          <Modal visible={viewMovieDetails !== null}>
            {viewMovieDetails && (
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                        marginVertical: 10,
                        color: "#909E84",
                      }}
                    >
                      This is the details of a movie
                    </Text>
                    <Text>Title: {viewMovieDetails.title}</Text>
                    <Text>Release Year: {viewMovieDetails.releaseYear}</Text>
                  </View>
                  <TouchableOpacity onPress={handleCloseDetailsModal}>
                    <Text style={{ fontWeight: "bold" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  txtMain: {
    fontSize: 16,
  },
  oneuser: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#909E84",
    borderStyle: "solid",
  },
  data: {
    flex: 1,
  },
  icons: {
    fontSize: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "black",
    fontSize: 16,
  },
  releaseYear: {
    color: "black",
    fontSize: 14,
  },
  deletebtn: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
  },
  deletecontent: {
    color: "red",
    textAlign: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  textinput: {
    borderWidth: 2,
    borderColor: "#909E84",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  content: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  addmovietittle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
