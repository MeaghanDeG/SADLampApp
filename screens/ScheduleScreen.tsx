import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BlurView } from 'expo-blur';
import { Card } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { saveSchedule, fetchSchedules } from '../util/database';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [scheduleInput, setScheduleInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const loadSchedules = async (date: string) => {
    try {
      const data = await fetchSchedules(date);
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedDate || !scheduleInput) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    const startTime = selectedStartTime.toISOString().split('T')[1].slice(0, 5); // "HH:MM"
    const endTime = selectedEndTime.toISOString().split('T')[1].slice(0, 5);

    try {
      await saveSchedule(selectedDate, scheduleInput, startTime, endTime);
      await loadSchedules(selectedDate);
      setScheduleInput('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Could not save schedule.');
    }
  };

  useEffect(() => {
    if (selectedDate) loadSchedules(selectedDate);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        markingType="simple"
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#ADD8E6' },
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setModalVisible(true);
        }}
      />
      <View style={styles.scheduleContainer}>
        {schedules.map((schedule, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={`${schedule.startTime} - ${schedule.endTime}`}
              subtitle={schedule.description}
            />
          </Card>
        ))}
      </View>

      {modalVisible && (
        <BlurView intensity={50} style={StyleSheet.absoluteFill}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Schedule for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter schedule description"
              value={scheduleInput}
              onChangeText={setScheduleInput}
            />
            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
              <Text>Start Time: {selectedStartTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showStartTimePicker}
              mode="time"
              onConfirm={(time) => {
                setSelectedStartTime(time);
                setShowStartTimePicker(false);
              }}
              onCancel={() => setShowStartTimePicker(false)}
            />
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <Text>End Time: {selectedEndTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showEndTimePicker}
              mode="time"
              onConfirm={(time) => {
                setSelectedEndTime(time);
                setShowEndTimePicker(false);
              }}
              onCancel={() => setShowEndTimePicker(false)}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
              <Text style={styles.addButtonText}>Add Schedule</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scheduleContainer: { marginTop: 16 },
  card: { marginBottom: 8 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { marginBottom: 16, borderWidth: 1, padding: 8 },
  addButton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8 },
  addButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
