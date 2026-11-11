import { StyleSheet } from 'react-native';

export const searchStyles = StyleSheet.create({
  filterSection: {
    paddingHorizontal: 6,
    backgroundColor: '#E2D7BD',
  },
  filterList: {
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F4ECDD',
    borderWidth: 1,
    borderColor: '#C9BDA3',
  },
  activeFilterButton: {
    backgroundColor: '#171717',
    borderColor: '#171717',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#514B40',
  },
  activeFilterText: {
    color: '#E2D7BD',
  },
  searchbar: {
    marginTop: 10,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
  },
  searchInput: {
    minHeight: 0,
    fontSize: 15,
    color: '#171717',
  },
});
