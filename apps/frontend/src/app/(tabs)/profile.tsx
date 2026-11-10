import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Avatar, Text, Button, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FilterOption, FILTERS } from '@/api/types';
import CardList from '@/components/card-list';
import { authClient } from '@/utils/auth-client';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { fetchMyTrades } from '@/api/myTrades';
import { fetchWishlist } from '@/api/myWishlist';

export default function Profile() {
  const router = useRouter();

  const [bio, setBio] = useState(
    'Magic player. Always looking for my next trade!',
  );
  const [editedBio, setEditedBio] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);

  const [activeSection, setActiveSection] = useState<'listings' | 'wishlist'>(
    'listings',
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const queryClient = new QueryClient();

  const handleSave = () => {
    setBio(editedBio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(bio);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.profileHeader}>
        <Avatar.Icon
          size={76}
          icon='account'
          color='#E2D7BD'
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.name}>Lucas Zales</Text>
          <Text style={styles.username}>@planeswalker</Text>
        </View>

        <Button
          mode='outlined'
          onPress={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setEditedBio(bio);
              setIsEditing(true);
            }
          }}
          textColor='#171717'
          style={styles.editButton}
          compact
        >
          {isEditing ? 'CANCEL' : 'EDIT'}
        </Button>
      </View>
      <View style={styles.bioContainer}>
        {isEditing ? (
          <>
            <TextInput
              mode='outlined'
              label='Your bio'
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
              maxLength={150}
              style={styles.bioInput}
              textColor='#171717'
              placeholderTextColor='#655d50'
              outlineColor='#655D50'
              activeOutlineColor='#171717'
            />
            <Button
              mode='contained'
              onPress={handleSave}
              buttonColor='#171717'
              textColor='#E2D7BD'
              style={styles.saveButton}
            >
              SAVE BIO
            </Button>
          </>
        ) : (
          <Text style={styles.bio}>{bio}</Text>
        )}
      </View>
      <View style={styles.logoutContainer}>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name='log-out-outline' size={20} color='#A12626' />
          <Text style={styles.logoutText}>LOG OUT</Text>
        </Pressable>
      </View>
      <View style={styles.decksSection}>
        <View style={styles.mainTabs}>
          <Pressable
            onPress={() => setActiveSection('listings')}
            style={[
              styles.mainTab,
              activeSection === 'listings' && styles.activeMainTab,
            ]}
          >
            <Text
              style={[
                styles.mainTabText,
                activeSection === 'listings' && styles.activeMainTabText,
              ]}
            >
              MY LISTINGS
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
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {FILTERS.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
      <CardList
        fetchlist={activeSection === 'listings' ? fetchMyTrades : fetchWishlist}
        query={searchQuery}
        activeFilter={activeFilter}
        emptyMessage={
          activeSection === 'listings'
            ? 'Unable to load your listings'
            : 'Unable to load your wishlist'
        }
        refreshOnFocus
        variant={activeSection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
    paddingHorizontal: 6,
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
  tradesTabs: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
    marginBottom: 15,
  },
  tradesTab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activetradesTab: {
    borderBottomColor: '#171717',
  },
  tradesTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#655D50',
  },
  activetradesTabText: {
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
  wishlistImage: {
    width: 55,
    height: 75,
    borderRadius: 6,
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
  filterSection: {
    marginBottom: 22,
  },
  filterList: {
    gap: 10,
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
});
