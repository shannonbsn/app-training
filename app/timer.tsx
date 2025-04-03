import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

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

export default function TimerScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
    const [showExerciseList, setShowExerciseList] = useState<boolean>(false);

    const [name, setName] = useState<string>("Exercice");
    const [duration, setDuration] = useState<number>(0);
    const [repetitions, setRepetitions] = useState<number>(1);
    const [pause, setPause] = useState<number>(0);

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [currentRep, setCurrentRep] = useState<number>(1);
    const [isResting, setIsResting] = useState<boolean>(false);

    useEffect(() => {
        if (params.session) {
            try {
                const sessionData = JSON.parse(params.session as string) as Session;
                setSession(sessionData);

                if (sessionData.exercises && sessionData.exercises.length > 0) {
                    const exercise = sessionData.exercises[0];
                    setName(exercise.name);
                    setDuration(parseInt(exercise.duration, 10));
                    setRepetitions(parseInt(exercise.repetitions, 10));
                    setPause(parseInt(exercise.pause, 10));
                    setTimeLeft(parseInt(exercise.duration, 10));
                }
            } catch (error) {
                console.error("Erreur lors du parsing de la session:", error);
            }
        } else {
            setName(typeof params.name === "string" ? params.name : "Exercice");
            setDuration(typeof params.duration === "string" ? parseInt(params.duration, 10) : 0);
            setRepetitions(typeof params.repetitions === "string" ? parseInt(params.repetitions, 10) : 1);
            setPause(typeof params.pause === "string" ? parseInt(params.pause, 10) : 0);
            setTimeLeft(typeof params.duration === "string" ? parseInt(params.duration, 10) : 0);
        }
    }, [params]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            if (!isResting && currentRep < repetitions) {
                setIsResting(true);
                setTimeLeft(pause);
            } else if (isResting) {
                setIsResting(false);
                setTimeLeft(duration);
                setCurrentRep(currentRep + 1);
            } else if (session && currentRep >= repetitions) {
                if (currentExerciseIndex < session.exercises.length - 1) {
                    const nextIndex = currentExerciseIndex + 1;
                    setCurrentExerciseIndex(nextIndex);

                    const nextExercise = session.exercises[nextIndex];
                    setName(nextExercise.name);
                    setDuration(parseInt(nextExercise.duration, 10));
                    setRepetitions(parseInt(nextExercise.repetitions, 10));
                    setPause(parseInt(nextExercise.pause, 10));
                    setTimeLeft(parseInt(nextExercise.duration, 10));
                    setCurrentRep(1);
                    setIsResting(false);
                }
            }
        }
    }, [timeLeft, isResting, currentRep, session, currentExerciseIndex]);

    const selectExercise = (index: number) => {
        if (!session) return;

        setCurrentExerciseIndex(index);
        const exercise = session.exercises[index];
        setName(exercise.name);
        setDuration(parseInt(exercise.duration, 10));
        setRepetitions(parseInt(exercise.repetitions, 10));
        setPause(parseInt(exercise.pause, 10));
        setTimeLeft(parseInt(exercise.duration, 10));
        setCurrentRep(1);
        setIsResting(false);
        setShowExerciseList(false);
    };

    if (showExerciseList && session) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Exercices de la séance: {session.name}</Text>
                <FlatList
                    data={session.exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => selectExercise(index)}
                            style={[
                                styles.exerciseItem,
                                index === currentExerciseIndex ? styles.activeExercise : {}
                            ]}
                        >
                            <Text style={styles.exerciseText}>
                                {item.name} - {item.duration}s x {item.repetitions} (pause: {item.pause}s)
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                <Button title="Retour au timer" onPress={() => setShowExerciseList(false)} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {session && (
                <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>
                        Séance: {session.name}
                    </Text>
                    <Text style={styles.exerciseCounter}>
                        Exercice {currentExerciseIndex + 1}/{session.exercises.length}
                    </Text>
                </View>
            )}

            <Text style={styles.title}>{name}</Text>
            <Text style={styles.repText}>Répétition {currentRep}/{repetitions}</Text>
            <Text style={styles.timer}>{timeLeft}s</Text>
            {isResting && <Text style={styles.restText}>Pause</Text>}
            {currentRep > repetitions && <Text style={styles.finished}>Terminé !</Text>}

            {session && (
                <TouchableOpacity
                    style={styles.listButton}
                    onPress={() => setShowExerciseList(true)}
                >
                    <Text style={styles.listButtonText}>Voir tous les exercices</Text>
                </TouchableOpacity>
            )}

            <Button title="Retour" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
        padding: 15,
    },
    sessionInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sessionTitle: {
        fontSize: 20,
        color: '#aaffaa',
        marginBottom: 5,
    },
    exerciseCounter: {
        fontSize: 16,
        color: '#dddddd',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    repText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    timer: {
        fontSize: 50,
        color: '#ff4444',
    },
    restText: {
        fontSize: 22,
        color: '#ffaa00',
        marginTop: 20,
    },
    finished: {
        fontSize: 22,
        color: '#00ff00',
        marginTop: 20,
    },
    listButton: {
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 10,
    },
    listButtonText: {
        color: '#fff',
    },
    exerciseItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#333',
        borderRadius: 8,
        width: '100%',
    },
    activeExercise: {
        backgroundColor: '#555',
        borderWidth: 1,
        borderColor: '#ff4444',
    },
    exerciseText: {
        color: '#fff',
    }
});