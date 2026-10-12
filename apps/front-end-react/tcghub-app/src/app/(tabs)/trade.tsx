import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// ─── Data ────────────────────────────────────────────────────────────────────
// Placeholder trades until the backend has a trades endpoint.

type TradeTab = 'incoming' | 'sent' | 'done';

type TradeStatus = 'new' | 'countered' | 'accepted' | 'pending' | 'completed' | 'declined';

type Trade = {
  id: string;
  tab: TradeTab;
  status: TradeStatus;
  player: string;
  initials: string;
  meta: string;
  give: string[];
  get: string[];
};

// How each status looks as a pill. A lookup object like this saves writing
// a long if/else chain wherever a status is shown.
const STATUS_STYLE: Record<TradeStatus, { label: string; bg: string; fg: string }> = {
  new: { label: 'NEW', bg: '#2e7d32', fg: '#FFFFFF' },
  countered: { label: 'COUNTERED', bg: '#C8B27A', fg: '#171717' },
  accepted: { label: 'ACCEPTED', bg: '#171717', fg: '#E2D7BD' },
  pending: { label: 'WAITING', bg: '#D8C9A8', fg: '#3A342B' },
  completed: { label: 'COMPLETED', bg: '#245f28', fg: '#FFFFFF' },
  declined: { label: 'DECLINED', bg: '#D8C9A8', fg: '#7A2E22' },
};

const TRADES: Trade[] = [
  {
    id: '1', tab: 'incoming', status: 'new',
    player: 'Jordan L.', initials: 'JL', meta: '1.2 km away · 12 min ago',
    give: ['Steel Leaf Champion ×2'], get: ['The One Ring'],
  },
  {
    id: '2', tab: 'incoming', status: 'countered',
    player: 'Priya K.', initials: 'PK', meta: '2.8 km away · 1 hr ago',
    give: ['Counterspell', 'Thoughtseize'], get: ['Orcish Bowmasters'],
  },
  {
    id: '3', tab: 'incoming', status: 'accepted',
    player: 'Marcus T.', initials: 'MT', meta: '4.5 km away · Yesterday',
    give: ['Sol Ring ×2'], get: ['Llanowar Elves ×4'],
  },
  {
    id: '4', tab: 'sent', status: 'pending',
    player: 'Alex R.', initials: 'AR', meta: '3.1 km away · 3 hrs ago',
    give: ['Lightning Bolt ×3'], get: ['Ragavan, Nimble Pilferer'],
  },
  {
    id: '5', tab: 'done', status: 'completed',
    player: 'Sam W.', initials: 'SW', meta: 'Last week',
    give: ['Swords to Plowshares'], get: ['Thoughtseize'],
  },
  {
    id: '6', tab: 'done', status: 'declined',
    player: 'Jordan L.', initials: 'JL', meta: '2 weeks ago',
    give: ['Counterspell ×2'], get: ['Sheoldred, the Apocalypse'],
  },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function TradeScreen() {
  const [tab, setTab] = useState<TradeTab>('incoming');

  const trades = TRADES.filter((trade) => trade.tab === tab);

  // The number on the INCOMING tab = offers still waiting on your answer.
  const needsReply = TRADES.filter(
    (trade) => trade.tab === 'incoming' && (trade.status === 'new' || trade.status === 'countered'),
  ).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>TRADES</Text>
          <Text style={styles.subtitle}>Offers from players near you.</Text>
        </View>

        <Pressable
          onPress={() => console.log('New offer pressed')}
          accessibilityRole="button"
          accessibilityLabel="Make a new trade offer"
          style={styles.newButton}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>OFFER</Text>
        </Pressable>
      </View>

      {/* Incoming / Sent / Done toggle */}
      <View style={styles.toggle} accessibilityRole="tablist">
        <ToggleButton
          label={needsReply > 0 ? `INCOMING · ${needsReply}` : 'INCOMING'}
          active={tab === 'incoming'}
          onPress={() => setTab('incoming')}
        />
        <ToggleButton label="SENT" active={tab === 'sent'} onPress={() => setTab('sent')} />
        <ToggleButton label="DONE" active={tab === 'done'} onPress={() => setTab('done')} />
      </View>

      {/* Trade list */}
      <View style={styles.tradeList}>
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </View>

      {trades.length === 0 && <Text style={styles.emptyMessage}>No trades here yet.</Text>}
    </ScrollView>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

type ToggleButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function ToggleButton({ label, active, onPress }: ToggleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
    >
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

function TradeCard({ trade }: { trade: Trade }) {
  const status = STATUS_STYLE[trade.status];

  return (
    <View style={styles.card}>
      {/* Who + status */}
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{trade.initials}</Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{trade.player}</Text>
          <Text style={styles.playerMeta}>{trade.meta}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: status.bg }]}>
          <Text style={[styles.pillText, { color: status.fg }]}>{status.label}</Text>
        </View>
      </View>

      {/* You give ⇄ You get */}
      <View style={styles.swapRow}>
        <View style={[styles.swapBox, styles.giveBox]}>
          <Text style={styles.swapLabel}>YOU GIVE</Text>
          {trade.give.map((card) => (
            <Text key={card} style={styles.swapCard}>{card}</Text>
          ))}
        </View>

        <View style={styles.swapIcon}>
          <Ionicons name="swap-horizontal" size={22} color="#171717" />
        </View>

        <View style={[styles.swapBox, styles.getBox]}>
          <Text style={[styles.swapLabel, styles.getLabel]}>YOU GET</Text>
          {trade.get.map((card) => (
            <Text key={card} style={[styles.swapCard, styles.getCard]}>{card}</Text>
          ))}
        </View>
      </View>

      <TradeActions trade={trade} />
    </View>
  );
}

// Which buttons show depends on the trade's status.
function TradeActions({ trade }: { trade: Trade }) {
  if (trade.status === 'new' || trade.status === 'countered') {
    return (
      <View style={styles.actionRow}>
        <Pressable
          onPress={() => console.log('Accept', trade.id)}
          accessibilityRole="button"
          accessibilityLabel={`Accept trade with ${trade.player}`}
          style={[styles.actionButton, styles.acceptButton]}
        >
          <Text style={[styles.actionText, styles.acceptText]}>ACCEPT</Text>
        </Pressable>
        <Pressable
          onPress={() => console.log('Counter', trade.id)}
          accessibilityRole="button"
          accessibilityLabel={`Counter trade with ${trade.player}`}
          style={[styles.actionButton, styles.outlineButton]}
        >
          <Text style={styles.actionText}>COUNTER</Text>
        </Pressable>
        <Pressable
          onPress={() => console.log('Decline', trade.id)}
          accessibilityRole="button"
          accessibilityLabel={`Decline trade with ${trade.player}`}
          style={styles.actionButton}
        >
          <Text style={[styles.actionText, styles.declineText]}>DECLINE</Text>
        </Pressable>
      </View>
    );
  }

  if (trade.status === 'accepted') {
    return (
      <Pressable
        onPress={() => console.log('Arrange meetup', trade.id)}
        accessibilityRole="button"
        accessibilityLabel={`Message ${trade.player} to arrange a meetup`}
        style={[styles.wideButton, styles.outlineButton]}
      >
        <Ionicons name="chatbubble-outline" size={18} color="#171717" />
        <Text style={styles.actionText}>ARRANGE MEETUP</Text>
      </Pressable>
    );
  }

  if (trade.status === 'pending') {
    return (
      <Pressable
        onPress={() => console.log('Cancel offer', trade.id)}
        accessibilityRole="button"
        accessibilityLabel={`Cancel your offer to ${trade.player}`}
        style={[styles.wideButton, styles.outlineButton]}
      >
        <Text style={styles.actionText}>CANCEL OFFER</Text>
      </Pressable>
    );
  }

  // Completed and declined trades have no actions.
  return null;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
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
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
  },
  newButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },

  // Toggle
  toggle: {
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

  // Trade list
  tradeList: {
    marginTop: 16,
    gap: 14,
  },
  card: {
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C9BB98',
    backgroundColor: '#EFE7D4',
  },

  // Card: who + status
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 16,
    color: '#E2D7BD',
  },
  playerInfo: {
    flex: 1,
    minWidth: 0,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  playerMeta: {
    fontSize: 13,
    color: '#5A5246',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pillText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 12,
    letterSpacing: 1.2,
  },

  // Card: you give ⇄ you get
  swapRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  swapBox: {
    flex: 1,
    gap: 6,
    padding: 10,
    borderRadius: 12,
  },
  giveBox: {
    backgroundColor: '#D8C9A8',
  },
  getBox: {
    backgroundColor: '#171717',
  },
  swapIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapLabel: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 12,
    letterSpacing: 1.4,
    color: '#5A5246',
  },
  getLabel: {
    color: '#B8AE98',
  },
  swapCard: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: '#171717',
  },
  getCard: {
    color: '#E2D7BD',
  },

  // Card: actions
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideButton: {
    flexDirection: 'row',
    gap: 8,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#2e7d32',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#171717',
  },
  actionText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#171717',
  },
  acceptText: {
    color: '#FFFFFF',
  },
  declineText: {
    color: '#7A2E22',
  },

  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },
});