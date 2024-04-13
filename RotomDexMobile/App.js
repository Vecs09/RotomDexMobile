import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

import logo from './assets/icon.png';

function Content() {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const pokemonRequests = data.results.map(async pokemon => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();

          const types = pokemonData.types.map(type => type.type.name);

          return {
            ...pokemonData,
            types,
          };
        });

        const pokemonData = await Promise.all(pokemonRequests);

        setItems(pokemonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredResults = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchTerm, items]);

  const handleSearch = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <FlatList
        data={searchTerm.trim() === '' ? items : searchResults}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.sprites.versions["generation-iv"]["diamond-pearl"].front_default }}
              style={styles.itemImage}
            />
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemType}>
                {item.types ? item.types.map((type, index) => (
                  <View key={index} style={[styles.typeBadge, { backgroundColor: typeColors[type] }]}>
                    <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                  </View>
                )) : 'Tipo no disponible'}
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.navbar2}>
        <Text style={styles.navbarTitle}>RotomDex</Text>
      </View>
      <Content />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#293587',
    opacity: 0.9,
  },
  navbar: {
    alignItems: 'center',
    height: 95,
    backgroundColor: '#f12228',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  navbar2: {
    height: 40,
    width: 533,
    alignItems: 'center',
    backgroundColor: '#f12228',
    borderColor: "#C40000",
    borderWidth: 4,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    width: '90%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    marginLeft: '5%', 
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // Agregar un fondo de color blanco
    marginTop: 20, // Separación desde el borde superior de la pantalla
    borderRadius: 20, // Agregar bordes redondeados
    marginHorizontal: 10, // Margen horizontal para centrarla en la pantalla
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFF8DC',
    borderColor: '#006400',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemType: {
    flexDirection: 'row',
    marginTop: 5,
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});

const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};
