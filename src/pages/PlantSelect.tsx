import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { EnviromentButton } from '../components/EnviromentButton';
import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnviromentProps {
  key: string;
  title: string;
}
interface PlantProps {
  id: string,
  name: string,
  about: string,
  water_tips: string,
  photo: string,
  environments: [string],
  frequency: {
    times: number,
    repeat_every: string
  }
}

export function PlantSelect() {

  //  Tipar o estado com a colecao que foi criado na interface
  const [enviroments, setEnviroments] = useState<EnviromentProps[]>([])
  const [plants, setPlants] = useState<PlantProps[]>([])
  const [filterdPlants, setFilteredPlants] = useState<PlantProps[]>([])
  const [enviromentSelected, setEnviromentSelected] = useState('all');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  function handleEnviromentSelected(environment: string) {
    setEnviromentSelected(environment);

    // se tiver em todos o botao entao enviar todos sem filtros
    if (environment === "all")
      return setFilteredPlants(plants);

    // agora se apertar algum botao que nao seja filtrado, entao retorne as plantas filtradas 
    const filtered = plants.filter(plant =>
      // As plantas filtradas atraves dos ambientes 
      plant.environments.includes(environment)
    );
    // e seta os dados filtrados para o estado auxiliar
    setFilteredPlants(filtered)

  }

  async function fetchPlants() {
    const { data } = await api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
    if (!data)
      return setLoading(true);

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data]);
      setFilteredPlants(oldValue => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data)
    }
    setLoading(false);
    setLoadingMore(false);

  }


  //  funcao para criar script para rolagem da tela de listagem das plantas
  function handleFetchMore(distance: number) {
    if (distance < 1)
      return;

    setLoadingMore(true)
    setPage(oldValue => oldValue + 1)
    fetchPlants();
  }

  useEffect(() => {
    async function fetchEviroment() {
      const { data } = await api
        .get('plants_environments?_sort=title&_order=asc');

      setEnviroments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data
      ])

    }

    fetchEviroment();

  }, []);

  useEffect(() => {
    fetchPlants();

  }, []);

  if (loading)
    return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title} >Em qual ambiente</Text>
        <Text style={styles.subtitle}>
          Vocẽ quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          data={enviroments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={item.key === enviromentSelected}
              onPress={() => handleEnviromentSelected(item.key)}
            />

          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filterdPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={colors.green} />
              : <></>
          }

        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 25,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,

  },
  header: {
    paddingHorizontal: 30
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginRight: 20,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  },

})