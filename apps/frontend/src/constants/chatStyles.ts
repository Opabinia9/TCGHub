
import { StyleSheet } from 'react-native';
import { Palette } from '@/constants/theme';

export const chatStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 48,
    lineHeight: 50,
    color: Palette.text,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
  },
  searchbar: {
    marginTop: 16,
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

  // List
  list: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.green,
    borderWidth: 1,
    borderColor: Palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBuyer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5148',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSeller: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.greenAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 17,
    color: Palette.text,
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
    color: Palette.text,
  },
  time: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  about: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.gold,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: Palette.textSecondary,
  },
  previewUnread: {
    fontWeight: '600',
    color: Palette.text,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.greenAccent,
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: Palette.textSecondary,
  },
  notFound: {
    marginTop: 40,
    textAlign: 'center',
    color: Palette.textSecondary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
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
    color: Palette.textSecondary,
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
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  listingThumbFrame: {
    width: 34,
    height: 46,
    padding: 2,
    borderRadius: 5,
    backgroundColor: Palette.surfaceElevated,
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
    color: Palette.text,
  },
  listingDetail: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  listingLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.gold,
  },

  messageScroll: {
    flex: 1,
    backgroundColor: Palette.background,
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
    color: Palette.textSecondary,
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
    backgroundColor: Palette.green,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    color: Palette.text,
  },
  bubbleTextMine: {
    color: Palette.text,
  },
  bubbleTime: {
    fontSize: 11,
    color: Palette.textSecondary,
  },

  composer: {
    gap: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.background,
  },
  quickReplies: {
    gap: 8,
  },
  quickReply: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.gold,
    justifyContent: 'center',
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Palette.gold,
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
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    fontSize: 16,
    color: Palette.text,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.greenAccent,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
