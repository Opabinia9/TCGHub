import { StyleSheet } from 'react-native';

export const chatStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 48,
    lineHeight: 50,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
  },
  searchbar: {
    marginTop: 16,
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

  // List
  list: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBuyer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C12323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSeller: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 17,
    color: '#E2D7BD',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
  },
  time: {
    fontSize: 12,
    color: '#5A5246',
  },
  about: {
    fontSize: 12,
    fontWeight: '600',
    color: '#245f28',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: '#5A5246',
  },
  previewUnread: {
    fontWeight: '600',
    color: '#171717',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e7d32',
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },
  notFound: {
    marginTop: 40,
    textAlign: 'center',
    color: '#5A5246',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  distance: {
    fontSize: 13,
    color: '#5A5246',
  },

  listing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C9BB98',
    backgroundColor: '#EFE7D4',
  },
  listingThumbFrame: {
    width: 34,
    height: 46,
    padding: 2,
    borderRadius: 5,
    backgroundColor: '#171717',
  },
  listingThumb: {
    flex: 1,
    borderRadius: 3,
  },
  listingText: {
    flex: 1,
    minWidth: 0,
  },
  listingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  listingDetail: {
    fontSize: 12,
    color: '#5A5246',
  },
  listingLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#245f28',
  },

  messageScroll: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    gap: 8,
  },
  dayLabel: {
    alignSelf: 'center',
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: '#5A5246',
  },
  bubbleWrap: {
    maxWidth: '78%',
    gap: 2,
  },
  bubbleWrapMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleWrapTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: '#171717',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#EFE7D4',
    borderWidth: 1,
    borderColor: '#C9BB98',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#171717',
  },
  bubbleTextMine: {
    color: '#E2D7BD',
  },
  bubbleTime: {
    fontSize: 11,
    color: '#5A5246',
  },

  composer: {
    gap: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  quickReplies: {
    gap: 8,
  },
  quickReply: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#171717',
    justifyContent: 'center',
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
    fontSize: 16,
    color: '#171717',
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
