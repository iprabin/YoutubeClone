import AsyncStorage from "@react-native-async-storage/async-storage";

let data = [];

export const storeData = async () => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("playlist", jsonValue);
    await getData();
  } catch (e) {}
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("playlist");
    const p = jsonValue != null ? JSON.parse(jsonValue) : [];
    data = p;
    return data;
  } catch (e) {}
};

export const addItem = async (item) => {
  const found = data.find((elem) => elem.id == item.id);
  if (found) return;
  data.push(item);
  await storeData();
};

export const removeItem = async (index) => {
  data.splice(index, 1);
  await storeData();
};
