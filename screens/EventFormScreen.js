import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Switch, Card, ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eventsAPI, aiAPI } from '../services/api';
import { useRouter, useLocalSearchParams } from 'expo-router';

const EventFormScreen = () => {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    description: '',
    location: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const response = await eventsAPI.getById(eventId);
      setFormData({
        ...response.data,
        date: new Date(response.data.date)
      });
    } catch (error) {
      console.error('Failed to load event:', error);
      alert('Failed to load event');
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      alert('Please enter an event title first');
      return;
    }
    setAiLoading(true);
    try {
      const response = await aiAPI.generateDescription({
        eventTitle: formData.title,
        eventType: 'general',
        audience: 'general audience',
        tone: 'professional'
      });
      setFormData(prev => ({
        ...prev,
        description: response.data.description
      }));
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Please enter an event title');
      return;
    }
    setLoading(true);
    try {
      const eventData = {
        ...formData,
        date: formData.date.toISOString()
      };
      if (eventId) {
        await eventsAPI.update(eventId, eventData);
      } else {
        await eventsAPI.create(eventData);
      }
      // Safer navigation: only go back if a previous screen exists
      if (router.canGoBack && router.canGoBack()) {
        router.back();
      } else {
        router.replace('/'); // go to event list
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Event Title"
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            mode="outlined"
            style={styles.input}
          />

            <View style={styles.dateContainer}>
              <Text variant="bodyMedium" style={styles.dateLabel}>
                Event Date & Time
              </Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                {formData.date.toLocaleString()}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData(prev => ({ ...prev, date: selectedDate }));
                  }
                }}
              />
            )}

          <TextInput
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.descriptionHeader}>
            <Text variant="bodyMedium" style={styles.descriptionLabel}>
              Description
            </Text>
            <Button
              mode="text"
              onPress={handleGenerateDescription}
              loading={aiLoading}
              disabled={aiLoading}
              compact
            >
              AI Generate
            </Button>
          </View>

          <TextInput
            label="Event Description"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <View style={styles.statusContainer}>
            <Text variant="bodyMedium">Publish Event</Text>
            <Switch
              value={formData.status === 'published'}
              onValueChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  status: value ? 'published' : 'draft'
                }))
              }
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
          >
            {eventId ? 'Update Event' : 'Create Event'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 },
  input: { marginBottom: 16 },
  dateContainer: { marginBottom: 16 },
  dateLabel: { marginBottom: 8 },
  dateButton: { alignSelf: 'flex-start' },
  descriptionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  descriptionLabel: { flex: 1 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingVertical: 8 },
  saveButton: { marginTop: 8 },
});

export default EventFormScreen;