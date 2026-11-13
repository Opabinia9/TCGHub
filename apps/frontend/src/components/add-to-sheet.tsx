
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MagicCard } from '@/api/types';
import { Palette } from '@/constants/theme';

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

export default function AddToSheet({
  type,
  card,
  onClose,
  onConfirm,
}: AddToSheetProps) {
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
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Image
              source={{
                uri: card.imageUris?.small ?? card.imageUris?.grid ?? undefined,
              }}
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
              <Ionicons name="close" size={20} color={Palette.text} />
            </Pressable>
          </View>

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
                      style={[
                        styles.chip,
                        selected && styles.chipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.quantityRow}>
            <View>
              <Text style={styles.label}>QUANTITY</Text>
              <Text style={styles.hint}>How many copies to add</Text>
            </View>

            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                style={[
                  styles.stepButton,
                  quantity <= 1 && styles.stepButtonDisabled,
                ]}
              >
                <Ionicons name="remove" size={20} color={Palette.text} />
              </Pressable>

              <Text style={styles.quantity} accessibilityLiveRegion="polite">
                {quantity}
              </Text>

              <Pressable
                onPress={() => setQuantity((q) => Math.min(99, q + 1))}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                style={[styles.stepButton, styles.stepButtonPlus]}
              >
                <Ionicons name="add" size={20} color={Palette.white} />
              </Pressable>
            </View>
          </View>

          {isListing && (
            <Text style={styles.note}>
              Listing a card also adds it to your collection, and removes it
              from your wishlist.
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  sheet: {
    gap: 20,
    paddingTop: 12,
    paddingHorizontal: 22,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.greenAccent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 48,
    height: 66,
    borderRadius: 7,
    backgroundColor: Palette.background,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 25,
    letterSpacing: 1.2,
    color: Palette.gold,
  },
  cardName: {
    fontSize: 14,
    color: Palette.textSecondary,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surfaceElevated,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.8,
    color: Palette.gold,
  },
  hint: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 3,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 12,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceElevated,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Palette.green,
    borderColor: Palette.gold,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  chipTextSelected: {
    color: Palette.white,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    padding: 4,
    borderRadius: 26,
    backgroundColor: Palette.surfaceElevated,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonPlus: {
    backgroundColor: Palette.greenAccent,
  },
  stepButtonDisabled: {
    opacity: 0.35,
  },
  quantity: {
    minWidth: 30,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 22,
    color: Palette.text,
  },
  note: {
    marginTop: -5,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textSecondary,
  },
  confirmButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Palette.greenAccent,
    borderWidth: 1,
    borderColor: Palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    letterSpacing: 2,
    color: Palette.white,
  },
});
