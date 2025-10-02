import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, List } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAuth } from '../../features/auth/useAuth';
import { ProfileScreenProps } from '../../navigation/navigation.types';

// Implements CUS-006
const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { user, logout } = useAuth();

  if (!user) {
    // This should ideally not happen if the screen is protected
    return null;
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Text size={80} label={user.name.charAt(0)} />
          <Text variant="headlineSmall" style={styles.name}>{user.name}</Text>
          <Text variant="bodyLarge" style={styles.contact}>{user.mobileNumber}</Text>
          <Text variant="bodyMedium" style={styles.contact}>{user.email}</Text>
        </View>

        <List.Section>
          <List.Item
            title="Manage Addresses"
            left={props => <List.Icon {...props} icon="map-marker-outline" />}
            onPress={() => navigation.navigate('AddressList', {isSelectMode: false})}
          />
          <List.Item
            title="Order History"
            left={props => <List.Icon {...props} icon="history" />}
            onPress={() => navigation.navigate('OrderHistory')}
          />
           <List.Item
            title="Data & Privacy"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            onPress={() => navigation.navigate('PrivacySettings')}
          />
          <List.Item
            title="Help & Support"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            onPress={() => { /* Navigate to Help Screen */ }}
          />
        </List.Section>

        <Button 
          mode="outlined" 
          onPress={logout} 
          style={styles.logoutButton}
        >
          Log Out
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  name: {
    marginTop: 12,
  },
  contact: {
      color: '#666',
  },
  logoutButton: {
    margin: 20,
  },
});

export default ProfileScreen;