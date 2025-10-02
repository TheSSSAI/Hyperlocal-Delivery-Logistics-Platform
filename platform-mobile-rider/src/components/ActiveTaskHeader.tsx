import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task, TaskStatus } from '../shared/types/task.types';

interface ActiveTaskHeaderProps {
  task: Task | null;
}

const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
        case 'Accepted':
            return {
                title: 'Head to Pickup',
                step: 1,
            };
        case 'ArrivedAtStore':
            return {
                title: 'Pick up the order',
                step: 1,
            };
        case 'InTransit':
            return {
                title: 'Head to Drop-off',
                step: 2,
            };
        case 'ArrivedAtDestination':
            return {
                title: 'Complete Delivery',
                step: 2,
            };
        default:
            return {
                title: 'Loading Task...',
                step: 0,
            };
    }
}

const ActiveTaskHeader: React.FC<ActiveTaskHeaderProps> = ({ task }) => {
  if (!task) {
    return null;
  }

  const { title, step } = getStatusInfo(task.status);
  const address = step === 1 ? task.pickupLocation.address : task.dropoffLocation.address;
  const locationName = step === 1 ? task.vendor.name : task.customer.name;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.step, step >= 1 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>Pickup</Text>
        </View>
        <View style={[styles.connector, step > 1 && styles.connectorActive]} />
        <View style={[styles.step, step >= 2 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>Drop-off</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.locationName}>{locationName}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  step: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#3A3A3C',
  },
  stepActive: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  connector: {
    height: 2,
    width: 40,
    backgroundColor: '#3A3A3C',
    marginHorizontal: -5,
  },
  connectorActive: {
    backgroundColor: '#007AFF',
  },
  infoContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationName: {
    color: '#EBEBF5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    color: '#AEAEB2',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ActiveTaskHeader;