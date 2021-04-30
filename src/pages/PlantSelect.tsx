import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { EnviromentButton } from '../components/EnviromentButton';
import { Header } from '../components/Header';
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
  const [filterdePlants, setFilteredPlants] = useState<PlantProps[]>([])
  const [enviromentSelected, setEnviromentSelected] = useState('all');

  function handleEnviromentSelected(environment: string) {
    setEnviromentSelected(environment);

    // se tiver em todos o botao entao enviar todos sem filtros
    if (environment === 'all')
      return setFilteredPlants(plants);
    
    // agora se apertar algum botao que nao seja filtrado, entao retorne as plantas filtradas 
    const filtered = plants.filter(plant =>
      // As plantas filtradas atraves dos ambientes 
        plant.environments.includes(environment)
    )
    // e seta os dados filtrados para o estado auxiliar
    setFilteredPlants(filtered)
    

  }

  useEffect(() => {
    async function fetchEviroment() {
      const { data } = await api
        .get('plants_environments?_sort=title&_order=asc');

      setEnviroments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data
      ])

    }

    fetchEviroment();

  }, []);

  useEffect(() => {
    async function fetchPlants() {
      const { data } = await api
        .get('plants?_sort=name&_order=asc');

      setPlants(data)

    }

    fetchPlants();


  }, [])

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
          data={filterdePlants}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}

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