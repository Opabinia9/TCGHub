
import { StyleSheet } from 'react-native';
import { Palette } from '@/constants/theme';

export const searchStyles = StyleSheet.create({
  filterSection: {
    paddingHorizontal: 6,
    backgroundColor: Palette.background,
  },
  filterList: {
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  activeFilterButton: {
    backgroundColor: Palette.green,
    borderColor: Palette.gold,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  activeFilterText: {
    color: Palette.gold,
  },
  searchbar: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  searchInput: {
    minHeight: 0,
    fontSize: 15,
    color: Palette.text,
  },
});
