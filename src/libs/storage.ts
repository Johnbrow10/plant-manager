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
      }));
  } catch (error) {
    throw new Error(error);
  }
}
