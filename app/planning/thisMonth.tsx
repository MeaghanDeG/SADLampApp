import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ThisMonthScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [scheduleInput, setScheduleInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [schedules, setSchedules] = useState<
    { date: string; description: string; startTime: string; endTime: string }[]
  >([]);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleAddSchedule = () => {
    if (!selectedDate || !scheduleInput) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }
    const startTime = selectedStartTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = selectedEndTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setSchedules(prev => [
      ...prev,
      { date: selectedDate, description: scheduleInput, startTime, endTime },
    ]);
    setScheduleInput('');
    setModalVisible(false);
  };

  const renderSchedules = () =>
    schedules
      .filter(schedule => schedule.date === selectedDate)
      .map((schedule, index) => (
        <View key={index} style={styles.scheduleItem}>
          <Text style={styles.scheduleText}>
            {schedule.startTime} - {schedule.endTime}: {schedule.description}
          </Text>
        </View>
      ));

  return (
    <View style={styles.container}>
      {/* Calendar for date selection */}
      <Calendar
        markingType="simple"
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#ADD8E6' },
        }}
        onDayPress={day => {
          setSelectedDate(day.dateString);
          setModalVisible(true); // Open modal when a date is selected
        }}
      />

      {/* Schedules */}
      <View style={styles.scheduleContainer}>
        {selectedDate ? (
          <>
            <Text style={styles.selectedDate}>Schedules for {selectedDate}</Text>
            {renderSchedules()}
          </>
        ) : (
          <Text style={styles.noSchedules}>Select a date to view or add schedules.</Text>
        )}
      </View>

      {/* Modal for adding schedules */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Schedule for {selectedDate}</Text>

            {/* Schedule Label */}
            <TextInput
              style={styles.input}
              placeholder="Enter schedule description"
              value={scheduleInput}
              onChangeText={setScheduleInput}
            />

            {/* Start Time Picker */}
            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerLabel}>
                Start Time: {selectedStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={selectedStartTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, date) => {
                  setShowStartTimePicker(false);
                  if (date) setSelectedStartTime(date);
                }}
              />
            )}

            {/* End Time Picker */}
            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerLabel}>
                End Time: {selectedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={selectedEndTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, date) => {
                  setShowEndTimePicker(false);
                  if (date) setSelectedEndTime(date);
                }}
              />
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button title="Add Schedule" onPress={handleAddSchedule} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scheduleContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noSchedules: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  scheduleItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scheduleText: {
    fontSize: 14,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
