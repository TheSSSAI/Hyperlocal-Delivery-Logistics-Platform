import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Switch, Card } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useProfile } from '../../features/profile/useProfile';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';

// Implements CUS-042
const PrivacySettingsScreen = () => {
  const { consents, isLoading, error, fetchConsents, updateConsents } = useProfile();
  const [localConsents, setLocalConsents] = useState<typeof consents>([]);

  useEffect(() => {
    fetchConsents();
  }, [fetchConsents]);

  useEffect(() => {
    if (consents) {
      setLocalConsents(consents);
    }
  }, [consents]);

  const handleToggle = (consentType: string) => {
    setLocalConsents(prev =>
      prev.map(consent =>
        consent.type === consentType ? { ...consent, isGranted: !consent.isGranted } : consent
      )
    );
  };
  
  const handleSaveChanges = async () => {
    const changes = localConsents.filter((local) => {
        const original = consents.find(c => c.type === local.type);
        return original && original.isGranted !== local.isGranted;
    });
    if(changes.length > 0) {
        await updateConsents(changes);
    }
  };

  const renderContent = () => {
    if (isLoading && !consents) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={fetchConsents} />;
    }

    return (
      <ScrollView>
        {localConsents.map(consent => (
          <Card key={consent.type} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text variant="titleMedium">{consent.title}</Text>
                <Text variant="bodyMedium" style={styles.description}>{consent.description}</Text>
              </View>
              <Switch
                value={consent.isGranted}
                onValueChange={() => handleToggle(consent.type)}
                disabled={consent.isMandatory}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Data & Privacy</Text>
        {renderContent()}
        <Button
            mode="contained"
            onPress={handleSaveChanges}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
        >
            Save Changes
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  description: {
    color: '#666',
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  }
});

export default PrivacySettingsScreen;