import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { ChatScreenProps } from '../../navigation/navigation.types';
import { realtimeService } from '../../services/realtimeService';
import { useAuth } from '../../features/auth/useAuth';

// This screen implements CUS-031, CUS-032, CUS-033
// For simplicity, it does not use a dedicated hook, but interacts with realtimeService directly.
// A more complex implementation would abstract this logic into a useChat hook.

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { orderId, recipient } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch initial message history via REST API
    // and then subscribe to WebSocket for real-time updates.
    
    // Mock initial fetch and readonly status
    // fetchHistory(orderId, recipient).then(data => {
    //   setMessages(data.messages);
    //   setIsReadOnly(data.isReadOnly);
    // });
    
    const messageSub = realtimeService.subscribeToChatMessages(orderId, (message) => {
      setMessages(prev => [message, ...prev]);
    });

    const orderStatusSub = realtimeService.subscribeToOrderStatus(orderId, (statusUpdate) => {
        if(statusUpdate.status === 'DELIVERED' || statusUpdate.status === 'CANCELLED'){
            setIsReadOnly(true);
        }
    });

    return () => {
      messageSub.unsubscribe();
      orderStatusSub.unsubscribe();
    };
  }, [orderId, recipient]);

  const handleSend = () => {
    if (newMessage.trim() === '' || isReadOnly) {
      return;
    }
    const messagePayload = {
      orderId,
      recipient, // 'VENDOR' or 'RIDER'
      text: newMessage.trim(),
    };
    realtimeService.sendChatMessage(messagePayload);
    // Optimistically update UI
    setMessages(prev => [{ text: newMessage.trim(), senderId: user?.id, timestamp: new Date().toISOString() }, ...prev]);
    setNewMessage('');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user?.id;
    return (
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.theirMessage]}>
        <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
      </View>
    );
  };
  
  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                inverted
                contentContainerStyle={styles.messageList}
            />
            {!isReadOnly ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        multiline
                    />
                    <Button onPress={handleSend}>Send</Button>
                </View>
            ) : (
                <Text style={styles.readOnlyText}>This chat is closed.</Text>
            )}
        </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 20,
        marginBottom: 10,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#6200ee',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
    },
    myMessageText: {
        color: 'white',
    },
    theirMessageText: {
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    readOnlyText: {
        textAlign: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        color: '#666',
    }
});

export default ChatScreen;