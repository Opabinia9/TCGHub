import { useState } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { Avatar, Text, Button, TextInput, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CardList from '@/components/card-list';
import { authClient } from '@/utils/auth-client';
import { QueryClient } from '@tanstack/react-query';
import { fetchMyTrades } from '@/api/myTrades';
import { fetchWishlist } from '@/api/myWishlist';
import { searchStyles } from '@/constants/search-filter-styles';
import { layout, Palette } from '@/constants/theme';
import { ToggleButton, buttonStyles } from '@/components/toggle-button';

export default function Profile() {
  const router = useRouter();

  const [bio, setBio] = useState(
    'Magic player. Always looking for my next trade!',
  );
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

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await authClient.signOut();
          queryClient.clear();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={layout.screen}>
      <View style={layout.top}>
        <View style={styles.profileHeader}>
          <Avatar.Icon
            size={76}
            icon='account'
            color={Palette.gold}
            style={styles.avatar}
          />

          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.name}>{session?.user.name}</Text>
            <Text style={styles.username}>@{session?.user.username}</Text>
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
            textColor={Palette.gold}
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
                textColor={Palette.text}
                placeholderTextColor={Palette.textSecondary}
                outlineColor={Palette.border}
                activeOutlineColor={Palette.gold}
                theme={{
                  colors: {
                    onSurfaceVariant: Palette.textSecondary,
                  },
                }}
              />

              <Button
                mode='contained'
                onPress={handleSave}
                buttonColor={Palette.greenAccent}
                textColor={Palette.white}
                style={styles.saveButton}
              >
                SAVE BIO
              </Button>
            </>
          ) : (
            <Text style={styles.bio}>{bio}</Text>
          )}
        </View>

        <View style={buttonStyles.toggle} accessibilityRole='tablist'>
          <ToggleButton
            label='MY TRADES'
            active={isTrades}
            onPress={() => setTab('trades')}
          />
          <ToggleButton
            label='WISHLIST'
            active={!isTrades}
            onPress={() => setTab('wishlist')}
          />
        </View>
        <View style={{ paddingBottom: 5 }}>
          <Searchbar
            placeholder='Search your cards...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={searchStyles.searchbar}
            inputStyle={searchStyles.searchInput}
            iconColor={Palette.gold}
            placeholderTextColor={Palette.textSecondary}
            selectionColor={Palette.gold}
            cursorColor={Palette.gold}
            elevation={0}
          />
        </View>

        <CardList
          key={tab}
          fetchlist={isTrades ? fetchMyTrades : fetchWishlist}
          query={searchQuery}
          activeFilter='all'
          emptyMessage={
            isTrades
              ? 'Unable to load your listings'
              : 'Unable to load your wishlist'
          }
          refreshOnFocus
          variant={isTrades ? 'trades' : 'wishlist'}
          footer={
            <View style={styles.logoutContainer}>
              <Pressable
                onPress={handleLogout}
                style={styles.logoutButton}
                accessibilityRole='button'
                accessibilityLabel='Log out'
              >
                <Ionicons
                  name='log-out-outline'
                  size={19}
                  color={Palette.textSecondary}
                />
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  top: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 15,
  },
  avatar: {
    backgroundColor: Palette.surfaceElevated,
    borderWidth: 1,
    borderColor: Palette.gold,
  },
  name: {
    color: Palette.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    color: Palette.textSecondary,
    fontSize: 14,
  },
  editButton: {
    borderColor: Palette.gold,
    borderRadius: 8,
  },
  bioContainer: {
    marginTop: 22,
  },
  bioInput: {
    backgroundColor: Palette.surface,
  },
  bio: {
    color: Palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  logoutContainer: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: Palette.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
