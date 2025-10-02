import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
import { ProductFilters } from '../../features/products/products.types';
import { COLORS, FONT_SIZES, SPACING } from '../../config/constants';

interface FilterComponentProps {
  initialFilters: ProductFilters;
  availableCategories: string[];
  onApplyFilters: (filters: ProductFilters) => void;
  onClose: () => void;
}

/**
 * @component FilterComponent
 * @description A presentational component for displaying and applying search filters.
 * It manages its own internal state for user selections and calls `onApplyFilters`
 * with the final state when the user confirms.
 * @see CUS-012
 * @param {FilterComponentProps} props
 */
const FilterComponent: React.FC<FilterComponentProps> = ({
  initialFilters,
  availableCategories,
  onApplyFilters,
  onClose,
}) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? undefined : category }));
  };

  const setRating = (rating: number) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? undefined : rating }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filters</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        {availableCategories.map(category => (
          <View key={category} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{category}</Text>
            <Switch
              value={filters.category === category}
              onValueChange={() => toggleCategory(category)}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={filters.category === category ? COLORS.primary : COLORS.gray}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating</Text>
        {[4, 3].map(rating => (
          <View key={rating} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{rating} Stars & Up</Text>
            <Switch
              value={filters.rating === rating}
              onValueChange={() => setRating(rating)}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={filters.rating === rating ? COLORS.primary : COLORS.gray}
            />
          </View>
        ))}
      </View>

      {/* Price Range would be a more complex component (e.g., slider)
          For this implementation, we'll keep it simple or omit if not core.
          A real implementation would use a slider or multi-button selector.
      */}

      <View style={styles.footer}>
        <Button title="Reset" onPress={handleReset} color={COLORS.secondary} />
        <Button title="Apply Filters" onPress={handleApply} color={COLORS.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    marginBottom: SPACING.medium,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.small,
  },
  switchLabel: {
    fontSize: FONT_SIZES.regular,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    paddingTop: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default FilterComponent;