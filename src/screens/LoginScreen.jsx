import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, TextInput, Button, Title, HelperText } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const validarEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const onLogin = () => {
    if (!validarEmail(email)) {
      setErro('Digite um email válido');
      return;
    }
    if (senha.length < 6) {
      setErro('Senha deve ter ao menos 6 caracteres');
      return;
    }
    setErro('');

    navigation.replace('Home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.box}>
          <Title style={styles.title}>Bem-vindo</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon name="email" />}
          />
          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon name="lock" />}
          />
          {erro ? <HelperText type="error">{erro}</HelperText> : null}
          <Button mode="contained" onPress={onLogin} style={styles.button}>
            Entrar
          </Button>

          <Text style={styles.text}>Esqueceu a senha?</Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    color: '#DAA520',
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#696969',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#DAA520',
  },
  text: {
    color: 'white',
  }
});
