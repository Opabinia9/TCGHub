import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MagicCard } from '@/api/types';
import { Palette } from '@/constants/theme';

type CreateDeckSheetProps = {
  card?: MagicCard; // optional: if given, shown in the header
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (deckName: string) => void;
};

export default function CreateDeckSheet({
  card,
  saving,
  error,
  onClose,
  onConfirm,
}: CreateDeckSheetProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');

  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && !saving;

  function submit() {
    if (canSave) onConfirm(trimmed);
  }

  return (
    <Modal
      visible
      transparent
      animationType='slide'
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole='button'
          accessibilityLabel='Close'
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            {card && (
              <Image
                source={{
                  uri:
                    card.imageUris?.small ?? card.imageUris?.grid ?? undefined,
                }}
                style={styles.thumb}
                contentFit='cover'
              />
            )}

            <View style={styles.headerText}>
              <Text style={styles.title}>NEW DECK</Text>
              {card && (
                <Text style={styles.cardName} numberOfLines={1}>
                  {card.name}
                </Text>
              )}
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole='button'
              accessibilityLabel='Close'
              style={styles.closeButton}
            >
              <Ionicons name='close' size={20} color={Palette.text} />
            </Pressable>
          </View>

          <View>
            <Text style={styles.label}>DECK NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='e.g. Mono-Red Aggro'
              placeholderTextColor={Palette.textSecondary}
              style={styles.input}
              autoFocus
              maxLength={60}
              returnKeyType='done'
              onSubmitEditing={submit}
              accessibilityLabel='Deck name'
            />
          </View>

          {card && (
            <Text style={styles.note}>
              This card will be added to the new deck.
            </Text>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={!canSave}
            accessibilityRole='button'
            style={[styles.confirmButton, !canSave && styles.confirmDisabled]}
          >
            {saving ? (
              <ActivityIndicator color={Palette.white} />
            ) : (
              <Text style={styles.confirmText}>CREATE DECK</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  input: {
    height: 50,
    marginTop: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceElevated,
    color: Palette.text,
    fontSize: 16,
  },
  note: {
    marginTop: -5,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textSecondary,
  },
  error: {
    marginTop: -5,
    fontSize: 13,
    color: '#D9705F',
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
  confirmDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    letterSpacing: 2,
    color: Palette.white,
  },
});
