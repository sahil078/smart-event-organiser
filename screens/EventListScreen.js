import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, FAB, Text, ActivityIndicator, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { eventsAPI } from '../services/api';

const EventListScreen = () => {
  const [events, setEvents] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadEvents = async ({ silent } = {}) => {
    try {
      if (!silent) setRefreshing(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error?.response?.data || error.message);
    } finally {
      if (initialLoading) setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = useCallback(() => {
    loadEvents({ silent: false });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#4CAF50';
      case 'ongoing': return '#2196F3';
      case 'draft': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const renderEventItem = ({ item }) => (
    <Card
      style={styles.eventCard}
      onPress={() => router.push({ pathname: '/event-detail', params: { eventId: item.id } })}
    >
      <Card.Content>
        <View style={styles.eventHeader}>
          <Text variant="titleMedium" style={styles.eventTitle}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.eventDate}>
          {item.date ? `${new Date(item.date).toLocaleDateString()} • ${item.location || 'N/A'}` : item.location || 'N/A'}
        </Text>
        <Text variant="bodySmall" numberOfLines={2} style={styles.eventDescription}>
          {item.description || 'No description'}
        </Text>
        {item.event_collaborators?.length > 0 && (
          <Text variant="bodySmall" style={styles.collaborators}>
            Collaborators: {item.event_collaborators.length}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text variant="titleMedium" style={styles.listTitle}>Events</Text>
        {/* <Button
          mode="contained"
          onPress={() => router.push('/event-form')}
          compact
        >
          New Event
        </Button> */}
      </View>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="titleMedium">No events yet</Text>
            <Text variant="bodyMedium">Create your first event</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/event-form')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  listTitle: { fontWeight: '600' },
  listContent: { padding: 16 },
  eventCard: { marginBottom: 12 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  eventTitle: { flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  eventDate: { marginBottom: 4, color: '#666' },
  eventDescription: { color: '#888', marginBottom: 4 },
  collaborators: { color: '#2196F3', marginTop: 4 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', padding: 40 }
});

export default EventListScreen;