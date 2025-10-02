import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAppSelector } from '@/store/hooks';
import { selectCurrentTaskOffer } from '../taskSlice';
import { useTask } from '../hooks/useTask';
import { TaskOfferCard } from '@/components/TaskOfferCard';
import { MainStackParamList } from '@/navigation/navigation.types';
import { AppTheme } from '@/shared/theme';

type TaskOfferScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Home'
>;

export const TaskOfferScreen: React.FC = () => {
  const navigation = useNavigation<TaskOfferScreenNavigationProp>();
  const taskOffer = useAppSelector(selectCurrentTaskOffer);
  const { acceptTask, rejectTask } = useTask();

  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!taskOffer) {
      // If the offer is rescinded or taken by another rider, navigate away.
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace('Home', { screen: 'Dashboard' });
      }
      return;
    }

    const calculateRemainingTime = () => {
      const expiresAt = new Date(taskOffer.expiresAt).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((expiresAt - now) / 1000));
    };

    setRemainingTime(calculateRemainingTime());

    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Auto-reject on timeout
          handleReject('timeout');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [taskOffer, navigation]);

  const handleAccept = useCallback(async () => {
    if (!taskOffer || isLoading) return;

    setIsLoading(true);
    try {
      await acceptTask(taskOffer.task.id);
      // On success, the global state will update, and the app will navigate to the ActiveTask screen.
      // This is handled by the root navigator's logic.
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to accept the task. It might have been taken by another rider.',
      );
      // The taskOffer will likely be cleared from state, triggering the useEffect cleanup.
      setIsLoading(false);
    }
  }, [taskOffer, acceptTask, isLoading]);

  const handleReject = useCallback(
    async (reason: 'explicit' | 'timeout' = 'explicit') => {
      if (!taskOffer || isLoading) return;
      if (reason === 'explicit') {
        setIsLoading(true);
      }
      try {
        await rejectTask(taskOffer.task.id, reason);
        // On success, the task offer is cleared from global state, which will trigger navigation.
      } catch (error: any) {
        if (reason === 'explicit') {
          Alert.alert('Error', error.message || 'Failed to reject the task.');
        }
        // If rejection fails, we let it time out.
      } finally {
        if (reason === 'explicit') {
          setIsLoading(false);
        }
      }
    },
    [taskOffer, rejectTask, isLoading],
  );

  if (!taskOffer) {
    // Render a loading state or null while navigating away
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TaskOfferCard
        task={taskOffer.task}
        remainingTime={remainingTime}
        onAccept={handleAccept}
        onReject={() => handleReject('explicit')}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.layout.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
  },
});