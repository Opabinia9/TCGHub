import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MagicCard } from '@/api/types';

export const CONDITIONS = [
  'Near mint',
  'Lightly played',
  'Moderately played',
  'Heavily played',
  'Damaged',
] as const;

export type Condition = (typeof CONDITIONS)[number];
export type SheetType = 'listing' | 'collection';

type AddToSheetProps = {
  type: SheetType;
  card: MagicCard;
  onClose: () => void;
  onConfirm: (quantity: number, condition: Condition) => void;
};

// Bottom panel for "Add to my listings" (condition + quantity)
// and "Add to collection" (quantity only).
export default function AddToSheet({ type, card, onClose, onConfirm }: AddToSheetProps) {
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<Condition>('Near mint');

  const isListing = type === 'listing';
  const title = isListing ? 'LIST FOR TRADE' : 'ADD TO COLLECTION';

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Dark area above the panel: tap it to close */}
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          {/* Header: card picture, title, close button */}
          <View style={styles.header}>
            <Image
              source={{ uri: card.imageUris?.small ?? card.imageUris?.grid ?? undefined }}
              style={styles.thumb}
              contentFit="cover"
            />
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.cardName} numberOfLines={1}>
                {card.name}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#171717" />
            </Pressable>
          </View>

          {/* Condition: listings only */}
          {isListing && (
            <View>
              <Text style={styles.label}>CONDITION</Text>
              <View style={styles.chips} accessibilityRole="radiogroup">
                {CONDITIONS.map((option) => {
                  const selected = option === condition;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setCondition(option)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <View>
              <Text style={styles.label}>QUANTITY</Text>
              <Text style={styles.hint}>
                How many copies to add
              </Text>
            </View>

            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                style={[styles.stepButton, quantity <= 1 && styles.stepButtonDisabled]}
              >
                <Ionicons name="remove" size={20} color="#171717" />
              </Pressable>

              <Text style={styles.quantity} accessibilityLiveRegion="polite">
                {quantity}
              </Text>

              <Pressable
                onPress={() => setQuantity((q) => Math.min(99, q + 1))}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                style={[styles.stepButton, styles.stepButtonDark]}
              >
                <Ionicons name="add" size={20} color="#E2D7BD" />
              </Pressable>
            </View>
          </View>

          {isListing && (
            <Text style={styles.note}>
              Listing a card also adds it to your collection, and removes it from your wishlist.
            </Text>
          )}

          <Pressable
            onPress={() => onConfirm(quantity, condition)}
            accessibilityRole="button"
            style={styles.confirmButton}
          >
            <Text style={styles.confirmText}>{title}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(23, 23, 23, 0.5)',
  },
  sheet: {
    gap: 18,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#E2D7BD',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#B9A985',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 44,
    height: 61,
    borderRadius: 6,
    backgroundColor: '#171717',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 24,
    letterSpacing: 1,
    color: '#171717',
  },
  cardName: {
    fontSize: 14,
    color: '#5A5246',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D8C9A8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Labels
  label: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.7,
    color: '#3A342B',
  },
  hint: {
    fontSize: 13,
    color: '#5A5246',
  },

  // Condition chips
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#171717',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#171717',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  chipTextSelected: {
    color: '#E2D7BD',
  },

  // Quantity stepper
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
    borderRadius: 26,
    backgroundColor: '#D8C9A8',
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFE7D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonDark: {
    backgroundColor: '#171717',
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  quantity: {
    minWidth: 32,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 22,
    color: '#171717',
  },

  note: {
    marginTop: -6,
    fontSize: 13,
    color: '#5A5246',
  },
  confirmButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 17,
    letterSpacing: 2,
    color: '#FFFFFF',
  },
});
