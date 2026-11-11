import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type ToggleButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function ToggleButton({ label, active, onPress }: ToggleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[buttonStyles.toggleButton, active && buttonStyles.toggleButtonActive]}
    >
      <Text style={[buttonStyles.toggleText, active && buttonStyles.toggleTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export const buttonStyles = StyleSheet.create({
  toggle: {
    marginTop: 10,
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#D8C9A8',
  },
  toggleButton: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#171717',
  },
  toggleText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#3A342B',
  },
  toggleTextActive: {
    color: '#E2D7BD',
  },
});
