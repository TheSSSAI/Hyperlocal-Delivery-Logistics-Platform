import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface EarningsSummaryProps {
  title: string;
  amount: number;
  period?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({
  title,
  amount,
  period,
  containerStyle,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {period && <Text style={styles.period}>{period}</Text>}
      </View>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#AEAEB2',
    fontSize: 16,
    fontWeight: '600',
  },
  period: {
    color: '#8E8E93',
    fontSize: 14,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default EarningsSummary;