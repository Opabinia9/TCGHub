import { StyleSheet } from 'react-native';

export const cardListStyles = StyleSheet.create({
  container: {
    backgroundColor: '#E2D7BD',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#77705F',
    textAlign: 'center',
  },
  loadMoreButton: {
    alignSelf: 'center',
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#171717',
  },
  loadMoreText: {
    color: '#E2D7BD',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  emptyText: {
    fontSize: 13,
    color: '#77705F',
  },
  content: {
    paddingTop: 24,
    paddingBottom: 400,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 22,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  cardSetName: {
    textAlign: 'center',
    fontSize: 11,
    color: '#77705F',
    marginTop: 5,
    marginBottom: 10,
  },
  wishlistButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#171717',
  },
  menuCatcher: {
    ...StyleSheet.absoluteFill,
  },
  previewTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  previewClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2A26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImageArea: {
    flex: 1,
    paddingVertical: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewInfo: {
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  previewName: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 28,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#F4EEDF',
  },
  previewSetName: {
    marginTop: 2,
    fontSize: 14,
    color: '#A79E8B',
  },
  previewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 14,
    borderRadius: 18,
    backgroundColor: '#E2D7BD',
  },
  previewPriceLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#5A5246',
  },
  previewPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 30,
    color: '#171717',
  },
  previewAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
    paddingLeft: 16,
    paddingRight: 20,
    borderRadius: 14,
    backgroundColor: '#2e7d32',
  },
  previewAddButtonActive: {
    backgroundColor: '#171717',
  },
  previewAddText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
  previewMenu: {
    position: 'absolute',
    right: 0,
    bottom: '100%',
    marginBottom: 10,
    width: 250,
    paddingVertical: 6,
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
  },
});
