import AsyncStorage from "@react-native-async-storage/async-storage";

import { format } from "date-fns";

export interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  dateTimeNotifcation: Date;
}

interface StoragePlantProps {
  [id: string]: {
    data: PlantProps;
  };
}

export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    // oldPlants vai retornar data se tiver dados na variavel um jsonParse com a tipagem de StoragePlantProps
    // caso estiver vazio retorna um objeto Vazio no lugar
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    // Variavel pega o id da planta atual para setar uma nova planta nesse obejto
    const newPlant = {
      [plant.id]: {
        data: plant,
      },
    };

    // seto os dados novos das plantas e tbm os dados antigos e assim quando salvar nao sobrescreveremos os dados antigos
    await AsyncStorage.setItem(
      "@plantmanager:plants",
      JSON.stringify({
        ...newPlant,
        ...oldPlants,
      })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    // plants vai retornar data se tiver dados na variavel um jsonParse com a tipagem de StoragePlantProps
    // caso estiver vazio retorna um objeto Vazio no lugar
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    // faz um map apra pegar cada planta salva com todos os dados e depois incluimos um campo de hora atualizada e formatada com a hora e minuto
    const plantsSorted = Object.keys(plants)
      .map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(
            new Date(plants[plant].data.dateTimeNotifcation),
            "HH:mm"
          ),
        };
      })
      .sort(
        (a, b) =>
          Math.floor(
            new Date(a.dateTimeNotifcation).getTime() / 1000 -
              Math.floor(new Date(b.dateTimeNotifcation).getTime() / 1000)
          )
        // ja esse sort va trazer dois campos que terao o A e b para capturar a primeira hora e depois a segunda hora e vai fazer menos a maior hora pela segunda
      );
    return plantsSorted;
  
  } catch (error) {
    throw new Error(error);
  }
}
