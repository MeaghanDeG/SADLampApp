import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function LampInfoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SAD Lamps: A Guide</Text>
      <Text style={styles.paragraph}>
        Seasonal Affective Disorder (SAD) lamps are specially designed light therapy devices that can help manage symptoms of depression caused by reduced sunlight exposure during the winter months. They mimic natural light. They are a popular solulotion for mild seasonal depression as they are easy to use, widely available and drug free
      </Text>
      <Text style={styles.subheading}>How Do They Work?</Text>
      <Text style={styles.paragraph}>
        SAD lamps emit bright light that stimulates the production of serotonin, a chemical in the brain that affects mood. Regular use can help improve your overall well-being. They are thought to improve the sleep/ wake cycle, also known as circadian rhythm,  when used regularily and at the same time every day.
      </Text>
      <Text style={styles.subheading}>Who Shouldn't Use One?</Text>
      <Text style={styles.paragraph}>
        First of all, always check with your doctor before beginning any treatment cycle. Some medicatio9n can make you sensitive to sunlight, or affect Vitmin D production and regulation. Eyes should be protected. If you are diagnosed ass Bipolar be advised that using the lamp may induce a manic episode.
      </Text>
      <Text style={styles.subheading}>Tips for Effective Use</Text>
      <Text style={styles.paragraph}>
        - Use your SAD lamp for 20–30 minutes daily in the morning.
        {"\n"}- Place it 16–24 inches away from your face.
        {"\n"}- Ensure it emits 10,000 lux of light intensity.
      </Text>
      <Text style={styles.footer}>
        Always consult a healthcare professional to determine if a SAD lamp is suitable for your needs. The lamp cannot be used as a substitute for daylight.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  footer: {
    fontSize: 14,
    color: '#888',
    marginTop: 24,
    textAlign: 'center',
  },
});
