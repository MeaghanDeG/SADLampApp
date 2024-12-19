import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '@/states/appStore';

type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
};

const questions: Question[] = [
  {
    id: '1',
    text: 'How many hours per day do you use your SAD lamp?',
    type: 'multiple-choice',
    options: ['Less than 1 hour', '1-2 hours', 'More than 2 hours'],
  },
  {
    id: '2',
    text: 'What time of day do you usually use your lamp?',
    type: 'multiple-choice',
    options: ['Morning', 'Afternoon', 'Evening'],
  },
  {
    id: '3',
    text: 'Do you feel your lamp helps improve your mood?',
    type: 'text',
  },
  {
    id: '4',
    text: 'What would you like to be known as (Name)?   Where do you live?    Have you been diagnosed with a mood disorder?     Are you currently under the care of a physician?   Do you feel the Winter Blues?   Can you set aside 20-30 min a day? Are ypou taking any medication that makes you sensitive to sunlight?  Would you like to save your progress? , 
    type: 'text',
  },
  {
    id: '5',
    text: 'DISCLAIMER     NOT PROMOTIONAL     Not a substitute for the advice of a physician',
    type: 'text',
  },{
    id: '6',
    text: 'Would you like to save your progress for reetrospection',
    type: 'text',
  },
];

export default function SadLampQuestions() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const saveResponses = useAppStore((state) => state.saveUserResponses);

  const handleResponseChange = (questionId: string, response: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleSubmit = () => {
    saveResponses(responses);
    alert('Thank you for your responses!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SAD Lamp Usage Questions</Text>
      {questions.map((question) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.text}</Text>
          {question.type === 'multiple-choice' && (
            <View style={styles.optionsContainer}>
              {question.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    responses[question.id] === option && styles.optionSelected,
                  ]}
                  onPress={() => handleResponseChange(question.id, option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {question.type === 'text' && (
            <TextInput
              style={styles.textInput}
              placeholder="Type your response here"
              value={responses[question.id] || ''}
              onChangeText={(text) => handleResponseChange(question.id, text)}
            />
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#000',
    textAlign: 'center',
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  submitButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
