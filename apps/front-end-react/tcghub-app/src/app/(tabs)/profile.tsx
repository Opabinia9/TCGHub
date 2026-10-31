
import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Avatar, Text, Button, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MY_DECKS = [
  { id: '1', name: 'Green Stompy', format: 'Modern', cardCount: 60, color: '#3F6B3A' },
  { id: '2', name: 'Blue Control', format: 'Commander', cardCount: 100, color: '#34506E' },
  { id: '3', name: 'Boros Aggro', format: 'Standard', cardCount: 60, color: '#8A3B2E' },
  { id: '4', name: 'Dimir Midrange', format: 'Pioneer', cardCount: 60, color: '#3B3550' },
];

export default function Profile() {
  const router = useRouter();

  const [bio, setBio] = useState(
    'Magic player. Always looking for my next trade!'
  );
  const [editedBio, setEditedBio] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);

  const [activeSection, setActiveSection] = useState<'collection' | 'wishlist'>('collection');
  const [activeCollectionTab, setActiveCollectionTab] = useState<'cards' | 'decks'>('cards');

  const handleSave = () => {
    setBio(editedBio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(bio);
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Avatar.Icon
          size={76}
          icon="account"
          color="#E2D7BD"
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.name}>Lucas Zales</Text>
          <Text style={styles.username}>@planeswalker</Text>
        </View>

        <Button
          mode="outlined"
          onPress={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setEditedBio(bio);
              setIsEditing(true);
            }
          }}
          textColor="#171717"
          style={styles.editButton}
          compact
        >
          {isEditing ? 'CANCEL' : 'EDIT'}
        </Button>
      </View>

      {/* Biography */}
      <View style={styles.bioContainer}>
        {isEditing ? (
          <>
            <TextInput
              mode="outlined"
              label="Your bio"
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
              maxLength={150}
              style={styles.bioInput}
              textColor="#171717"
              placeholderTextColor="#655d50"
              outlineColor="#655D50"
              activeOutlineColor="#171717"
            />

            <Button
              mode="contained"
              onPress={handleSave}
              buttonColor="#171717"
              textColor="#E2D7BD"
              style={styles.saveButton}
            >
              SAVE BIO
            </Button>
          </>
        ) : (
          <Text style={styles.bio}>{bio}</Text>
        )}
      </View>

      {/* Collection and Wishlist */}
      <View style={styles.decksSection}>

        {/* Main tabs */}
        <View style={styles.mainTabs}>
          <Pressable
            onPress={() => setActiveSection('collection')}
            style={[
              styles.mainTab,
              activeSection === 'collection' && styles.activeMainTab,
            ]}
          >
            <Text
              style={[
                styles.mainTabText,
                activeSection === 'collection' && styles.activeMainTabText,
              ]}
            >
              MY COLLECTION
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveSection('wishlist')}
            style={[
              styles.mainTab,
              activeSection === 'wishlist' && styles.activeMainTab,
            ]}
          >
            <Text
              style={[
                styles.mainTabText,
                activeSection === 'wishlist' && styles.activeMainTabText,
              ]}
            >
              MY WISHLIST
            </Text>
          </Pressable>
        </View>

        {/* Collection content */}
        {activeSection === 'collection' ? (
          <>
            <View style={styles.collectionTabs}>
              <Pressable
                onPress={() => setActiveCollectionTab('cards')}
                style={[
                  styles.collectionTab,
                  activeCollectionTab === 'cards' && styles.activeCollectionTab,
                ]}
              >
                <Text
                  style={[
                    styles.collectionTabText,
                    activeCollectionTab === 'cards' && styles.activeCollectionTabText,
                  ]}
                >
                  CARDS
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveCollectionTab('decks')}
                style={[
                  styles.collectionTab,
                  activeCollectionTab === 'decks' && styles.activeCollectionTab,
                ]}
              >
                <Text
                  style={[
                    styles.collectionTabText,
                    activeCollectionTab === 'decks' && styles.activeCollectionTabText,
                  ]}
                >
                  DECKS
                </Text>
              </Pressable>
            </View>

            {activeCollectionTab === 'cards' ? (
              <Text style={styles.emptyMessage}>
                Your collection is empty.
              </Text>
            ) : (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>MY DECKS</Text>
                  <Text style={styles.deckCount}>{MY_DECKS.length} decks</Text>
                </View>

                {MY_DECKS.map((deck) => (
                  <View key={deck.id} style={styles.deckRow}>
                    <View
                      style={[styles.deckArt, { backgroundColor: deck.color }]}
                    >
                      <Ionicons name="layers" size={24} color="#FFFFFF" />
                    </View>

                    <View style={styles.deckInfo}>
                      <Text style={styles.deckName}>{deck.name}</Text>
                      <Text style={styles.deckMeta}>
                        {deck.format} · {deck.cardCount} cards
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#655D50"
                    />
                  </View>
                ))}
              </>
            )}
          </>
        ) : (
          <Text style={styles.emptyMessage}>
            Your wishlist is empty.
          </Text>
        )}
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Pressable
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Ionicons name="log-out-outline" size={20} color="#A12626" />
          <Text style={styles.logoutText}>LOG OUT</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 15,
  },
  avatar: {
    backgroundColor: '#171717',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#171717',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    color: '#655D50',
    fontSize: 14,
  },
  editButton: {
    borderColor: '#171717',
    borderRadius: 8,
  },
  bioContainer: {
    marginTop: 22,
  },
  bio: {
    color: '#171717',
    fontSize: 15,
    lineHeight: 22,
  },
  bioInput: {
    backgroundColor: '#F4EBDD',
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  decksSection: {
    marginTop: 40,
  },
  mainTabs: {
    flexDirection: 'row',
    backgroundColor: '#C9BB98',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 20,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeMainTab: {
    backgroundColor: '#171717',
  },
  mainTabText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#171717',
  },
  activeMainTabText: {
    color: '#E2D7BD',
  },
  collectionTabs: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
    marginBottom: 15,
  },
  collectionTab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeCollectionTab: {
    borderBottomColor: '#171717',
  },
  collectionTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#655D50',
  },
  activeCollectionTabText: {
    color: '#171717',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#171717',
    fontSize: 22,
    fontWeight: 'bold',
  },
  deckCount: {
    color: '#655D50',
    fontSize: 13,
  },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  deckArt: {
    width: 55,
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    color: '#171717',
    fontSize: 17,
    fontWeight: 'bold',
  },
  deckMeta: {
    color: '#655D50',
    fontSize: 13,
    marginTop: 3,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#655D50',
    paddingVertical: 35,
  },
  logoutContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#A12626',
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
  },
  logoutText: {
    color: '#A12626',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
