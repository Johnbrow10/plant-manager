import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';
import waterDrop from '../assets/waterdrop.png';
import { PlantProps, loadPlant } from '../libs/storage';
import { useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>()

  useEffect(() => {
    async function loadStorageData() {
      // carregar as plantas 
      const plantsStoraged = await loadPlant()

      // calcula a distancia de uma data para outra
      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotifcation).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      // funcao para alertar o usuario a regar a proxima vez a planta
      setNextWaterd(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`
      );

      setMyPlants(plantsStoraged);
      setLoading(false)

    };

    loadStorageData();
  }, [])


  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image
          source={waterDrop}
          style={styles.spotlightImage}
        />

        <Text style={styles.spotlightText} >
          {nextWaterd}
        </Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary data={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />



      </View>

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60,

  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',

  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  }

})