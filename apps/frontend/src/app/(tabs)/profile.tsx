import { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Avatar, Text, Button, TextInput, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CardList from '@/components/card-list';
import { authClient } from '@/utils/auth-client';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { fetchMyTrades } from '@/api/myTrades';
import { fetchWishlist } from '@/api/myWishlist';
import { searchStyles } from '@/constants/search-filter-styles';
import { layout } from '@/constants/theme';
import { ToggleButton, buttonStyles } from '@/components/toggle-button';

export default function Profile() {
  const router = useRouter();

  const [bio, setBio] = useState('Magic player. Always looking for my next trade!');
  const [editedBio, setEditedBio] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);
  const [tab, setTab] = useState<'trades' | 'wishlist'>('trades');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = new QueryClient();
  const { data: session } = authClient.useSession();
  const isTrades = tab === 'trades';

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
    <View style={layout.screen}>
      <View style={layout.top}>
        <View style={styles.profileHeader}>
          <Avatar.Icon size={76} icon="account" color="#E2D7BD" style={styles.avatar} />

          <View style={styles.userInfo}>
            <Text style={styles.name}>{session?.user.name}</Text>
            <Text style={styles.username}>@{session?.user.username}</Text>
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

        <View style={styles.logoutContainer}>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#A12626" />
            <Text style={styles.logoutText}>LOG OUT</Text>
          </Pressable>
        </View>

        <View style={buttonStyles.toggle} accessibilityRole="tablist">
          <ToggleButton label="MY TRADES" active={isTrades} onPress={() => setTab('trades')} />
          <ToggleButton label="WISHLIST" active={!isTrades} onPress={() => setTab('wishlist')} />
        </View>

        <Searchbar
          placeholder="Search your cards..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={searchStyles.searchbar}
          inputStyle={searchStyles.searchInput}
          iconColor="#245f28"
          placeholderTextColor="#7A705F"
          selectionColor="#171717"
          cursorColor="#171717"
          elevation={0}
        />

        <CardList
          fetchlist={isTrades ? fetchMyTrades : fetchWishlist}
          query={searchQuery}
          activeFilter="all"
          emptyMessage={isTrades ? 'Unable to load your listings' : 'Unable to load your wishlist'}
          refreshOnFocus
          variant={isTrades ? 'trades' : 'wishlist'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
