import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

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

const SessionsScreen = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const storedSessions = await AsyncStorage.getItem('sessions');
                if (storedSessions) {
                    setSessions(JSON.parse(storedSessions));
                }
            } catch (error) {
                console.error("Erreur lors du chargement des séances :", error);
            }
        };

        loadSessions();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Séances enregistrées</Text>
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/timer",
                            params: { session: JSON.stringify(item) }
                        })}
                        style={styles.sessionItem}
                    >
                        <Text style={styles.sessionText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sessionItem: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    sessionText: {
        fontSize: 18,
    },
});

export default SessionsScreen;