import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@/store/hooks';

import { selectActiveTask } from '../taskSlice';
import { useTask } from '../hooks/useTask';
import { MainStackParamList } from '@/navigation/navigation.types';
import { ActiveTaskHeader } from '@/components/ActiveTaskHeader';
import { NavigationMapView } from '../components/NavigationMapView';
import { ProofOfDelivery } from '../components/ProofOfDelivery';
import { AppTheme } from '@/shared/theme';
import { TaskStatus } from '@/shared/types/task.types';
import { Button, Text } from 'react-native-paper';
import { PODPhoto } from '../task.types';

type ActiveTaskScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Home'
>;

export const ActiveTaskScreen: React.FC = () => {
  const navigation = useNavigation<ActiveTaskScreenNavigationProp>();
  const activeTask = useAppSelector(selectActiveTask);
  const { updateTaskStatus, submitPhotoPod, submitOtpPod } = useTask();

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // If there's no active task, the user shouldn't be on this screen.
    if (!activeTask) {
      navigation.replace('Home', { screen: 'Dashboard' });
    }
  }, [activeTask, navigation]);

  const handleStatusUpdate = useCallback(
    async (newStatus: TaskStatus) => {
      if (!activeTask || isUpdating) return;
      setIsUpdating(true);
      try {
        await updateTaskStatus(activeTask.id, newStatus);
      } catch (error: any) {
        Alert.alert(
          'Update Failed',
          error.message || 'Could not update task status. Please check your connection and try again.',
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [activeTask, updateTaskStatus, isUpdating],
  );

  const handlePhotoSubmit = useCallback(async (photo: PODPhoto) => {
    if (!activeTask || isUpdating) return;
    setIsUpdating(true);
    try {
      await submitPhotoPod(activeTask.id, photo);
      // after successful POD, we can mark as delivered
      await handleStatusUpdate(TaskStatus.Delivered);
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message || 'Could not submit proof of delivery.');
    } finally {
      setIsUpdating(false);
    }
  }, [activeTask, submitPhotoPod, handleStatusUpdate, isUpdating]);

  const handleOtpSubmit = useCallback(async (otp: string) => {
    if (!activeTask || isUpdating) return;
    setIsUpdating(true);
    try {
      await submitOtpPod(activeTask.id, otp);
       // after successful POD, we can mark as delivered
      await handleStatusUpdate(TaskStatus.Delivered);
    } catch (error: any) {
      Alert.alert('OTP Invalid', error.message || 'The entered OTP is incorrect. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }, [activeTask, submitOtpPod, handleStatusUpdate, isUpdating]);

  if (!activeTask) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTask.status) {
      case TaskStatus.Accepted:
        return (
          <>
            <NavigationMapView destination={activeTask.pickupLocation.coordinates} />
            <View style={styles.actionContainer}>
              <Button
                mode="contained"
                onPress={() => handleStatusUpdate(TaskStatus.ArrivedAtStore)}
                loading={isUpdating}
                disabled={isUpdating}
                style={styles.actionButton}
                labelStyle={styles.buttonText}
              >
                Arrived at Store
              </Button>
            </View>
          </>
        );
      case TaskStatus.ArrivedAtStore:
        return (
          <View style={styles.centeredActionContainer}>
            <Text variant="headlineSmall" style={styles.infoText}>You have arrived at the vendor.</Text>
            <Text variant="bodyLarge" style={styles.infoText}>Please collect the order.</Text>
            <Button
              mode="contained"
              onPress={() => handleStatusUpdate(TaskStatus.InTransit)}
              loading={isUpdating}
              disabled={isUpdating}
              style={[styles.actionButton, styles.pickupButton]}
              labelStyle={styles.buttonText}
            >
              Confirm Pickup
            </Button>
          </View>
        );
      case TaskStatus.InTransit:
        return (
          <>
            <NavigationMapView destination={activeTask.dropoffLocation.coordinates} />
            <View style={styles.actionContainer}>
              <Button
                mode="contained"
                onPress={() => handleStatusUpdate(TaskStatus.ArrivedAtDestination)}
                loading={isUpdating}
                disabled={isUpdating}
                style={styles.actionButton}
                labelStyle={styles.buttonText}
              >
                Arrived at Destination
              </Button>
            </View>
          </>
        );
      case TaskStatus.ArrivedAtDestination:
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ProofOfDelivery
              podMethod={activeTask.podMethod}
              onPhotoSubmit={handlePhotoSubmit}
              onOtpSubmit={handleOtpSubmit}
              isLoading={isUpdating}
            />
          </ScrollView>
        );
      default:
        return (
          <View style={styles.loadingContainer}>
            <Text style={styles.infoText}>Syncing task status...</Text>
            <ActivityIndicator size="large" color={AppTheme.colors.primary} />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ActiveTaskHeader task={activeTask} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: AppTheme.layout.padding,
    backgroundColor: AppTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  centeredActionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.layout.padding,
  },
  actionButton: {
    paddingVertical: 8,
    borderRadius: AppTheme.roundness.xl,
  },
  pickupButton: {
    marginTop: AppTheme.layout.margin * 2,
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: AppTheme.layout.margin,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});