import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Platform, SafeAreaView, StyleSheet, Text, TextInput, View, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';


export function UserIdentification() {

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [name, setName] = useState<string>();

  const navigation = useNavigation();

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!name)
  }

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputChange(value: string) {
    // caso ele nao te conteudo vai ser falso, caso ele tenha conteudo vai ser verdadeiro
    setIsFilled(!!value)
    setName(value)
  }


  async function handleSubmit() {

    if (!name)
      return Alert.alert('Me diz como chamar você 😢')

    try {

      await AsyncStorage.setItem('@plantmanager:user', name);

      navigation.navigate('Confirmation');

    } catch {
      Alert.alert('Não Foi Possivel salvar o seu nome 😢')
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>
                  {isFilled ? '🤗' : '🤔'}
                </Text>
                <Text style={styles.title}>Como podemos {'\n'}
                  chamar você?
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) && { borderColor: colors.green },
                ]}
                placeholder="Digite seu nome"
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}

              />
              {/* o estilo de espaco e afins sempre fazer na pagina importada e nao no componente */}
              <View style={styles.footer}>
                <Button
                  title="Confirmar"
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center'
  },
  emoji: {
    fontSize: 44
  },
  header: {
    alignItems: 'center'
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',

  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20
  }
});