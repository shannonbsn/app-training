import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Exercise = {
  id: string;
  name: string;
  duration: string;
  repetitions: string;
  pause: string;
};

type Session = {
  id: string;
  name: string;
  exercises: Exercise[];
};

export default function HomeScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [pause, setPause] = useState('');

  const addExercise = () => {
    if (name && duration && repetitions && pause) {
      setExercises([...exercises, { id: Date.now().toString(), name, duration, repetitions, pause }]);
      setName('');
      setDuration('');
      setRepetitions('');
      setPause('');
    }
  };

  const createSession = async () => {
    if (sessionName && exercises.length > 0) {
      const newSession = { id: Date.now().toString(), name: sessionName, exercises };
      const updatedSessions = [...sessions, newSession];

      setSessions(updatedSessions);
      setSessionName('');
      setExercises([]);

      try {
        await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des séances :", error);
      }
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une séance d'entraînement</Text>

      <Text style={styles.title}>Ajoute un exercice</Text>

      <TextInput placeholder="Nom de l'exercice" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Durée (s)" value={duration} onChangeText={setDuration} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Nombre de répétitions" value={repetitions} onChangeText={setRepetitions} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Pause entre répétitions (s)" value={pause} onChangeText={setPause} keyboardType="numeric" style={styles.input} />

      <Button title="Ajouter l'exercice" onPress={addExercise} />

      <TextInput
        placeholder="Nom de la séance"
        value={sessionName}
        onChangeText={setSessionName}
        style={styles.input}
      />
      <Button title="Créer la séance" onPress={createSession} />

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/timer", params: item })}
            style={styles.item}
          >
            <Text>{item.name} - {item.duration}s x {item.repetitions} (pause : {item.pause}s)</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Voir les séances" onPress={() => router.push("/sessions")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginTop: 10,
  },
});