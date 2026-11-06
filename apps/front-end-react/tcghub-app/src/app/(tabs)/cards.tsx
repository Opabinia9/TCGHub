
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
	ActivityIndicator,
} from "react-native";
import { Menu, Text, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { fetchCards, type MagicCard, type Pagination } from "@/api/cards";
import { useWishlist } from "@/context/WishlistContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddToSheet, { type Condition, type SheetType } from "@/components/add-to-sheet";

const FILTERS = [
	"All",
	"Creature",
	"Sorcery",
	"Enchantment",
	"Instant",
	"Artifact",
	"Land",
] as const;

type FilterOption = (typeof FILTERS)[number];

// The add to button
function menuIcon(name: keyof typeof Ionicons.glyphMap) {
	return ({ size }: { size: number }) => (
		<Ionicons name={name} size={size} color="#245f28" />
	);
}

export default function CardsScreen() {
	const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);
	const [cards, setCards] = useState<MagicCard[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const { wishlistCards, toggleWishlist } = useWishlist();
	const insets = useSafeAreaInsets();

	// Which card's + menu is open (null = none). Only one can be open at a time.
	const [menuCardId, setMenuCardId] = useState<string | null>(null);
	const closeMenu = () => setMenuCardId(null);

	// The listing / collection panel that's open (null = none).
	const [sheet, setSheet] = useState<{ type: SheetType; card: MagicCard } | null>(null);

	// Is the + menu in the fullscreen view open?
	const [previewMenuOpen, setPreviewMenuOpen] = useState(false);

	// Closes the fullscreen view (and its menu, so it's closed next time too).
	function closePreview() {
		setSelectedCard(null);
		setPreviewMenuOpen(false);
	}

	function openSheet(type: SheetType, card: MagicCard) {
		closeMenu();
		setPreviewMenuOpen(false);
		setSheet({ type, card });
	}

	function handleConfirm(quantity: number, condition: Condition) {
		if (!sheet) return;
		const { type, card } = sheet;

		// Backend rule: a card you own or list can't also be on your wishlist.
		if (wishlistCards.some((item) => item.id === card.id)) {
			toggleWishlist(card);
		}

		// What we'll send to POST /api/v1/collection once it's connected.
		console.log("POST /api/v1/collection", {
			card_id: card.id,
			quantity,
			condition: type === "listing" ? condition : undefined,
			for_trade: type === "listing",
			wishlist: false,
		});

		setSheet(null);
	}

	// Load cards from the API, or use temporary cards if it fails.
	useEffect(() => {
		let cancelled = false;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		setLoading(true);
		setError(null);

		const timer = setTimeout(async () => {
			try {
				const result = await Promise.race([
					fetchCards(searchQuery.trim()),
					new Promise<never>((_, reject) => {
						timeoutId = setTimeout(() => {
							reject(new Error("Request timeout"));
						}, 5000);
					}),
				]);

				if (!cancelled) {
					setCards(result.items);
					setPagination(result.pagination);
				}
			} catch {
				if (!cancelled) {
					setCards([]);
					setPagination(null);
					setError("Unable to load cards. Please try again later.");
				}
			} finally {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				if (!cancelled) {
					setLoading(false);
				}
			}
		}, 300);

		return () => {
			cancelled = true;
			clearTimeout(timer);

			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [searchQuery]);

	// Load the next page of cards.
	async function loadMore() {
		if (loading || !pagination || loadingMore) return;
		if (pagination.page >= pagination.totalPages) return;

		try {
			setLoadingMore(true);

			const result = await fetchCards(
				searchQuery.trim(),
				pagination.page + 1,
			);

			setCards((previousCards) => [
				...previousCards,
				...result.items,
			]);

			setPagination(result.pagination);
		} catch {
			// More cards could not be loaded.
		} finally {
			setLoadingMore(false);
		}
	}

	// Is the card open in the fullscreen view on the wishlist?
	const selectedInWishlist =
		selectedCard !== null &&
		wishlistCards.some((item) => item.id === selectedCard.id);

	// The listing / collection panel, built once so we can show it in two places.
	const sheetPanel = sheet && (
		<AddToSheet
			type={sheet.type}
			card={sheet.card}
			onClose={() => setSheet(null)}
			onConfirm={handleConfirm}
		/>
	);

	const filteredCards = cards.filter(
		(card) => activeFilter === "All" || card.category === activeFilter,
	);

	return (
		<>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.header}>
					<Text style={styles.eyebrow}>YOUR MAGIC COLLECTION</Text>
					<Text style={styles.title}>EXPLORE CARDS</Text>
					<Text style={styles.subtitle}>
						Discover cards for your next trade.
					</Text>
				</View>

				<View style={styles.searchBar}>
					<Ionicons name="search-outline" size={20} color="#77705F" />

					<TextInput
						placeholder="Search your cards..."
						value={searchQuery}
						onChangeText={setSearchQuery}
						mode="flat"
						underlineColor="transparent"
						activeUnderlineColor="transparent"
						style={styles.searchInput}
						contentStyle={styles.searchInputContent}
						placeholderTextColor="#77705F"
						textColor="#171717"
						selectionColor="#171717"
						cursorColor="#171717"
					/>

					{searchQuery.length > 0 && (
						<Pressable onPress={() => setSearchQuery("")}>
							<Ionicons
								name="close-circle"
								size={20}
								color="#77705F"
							/>
						</Pressable>
					)}
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
									activeFilter === filter &&
									styles.activeFilterButton,
								]}
							>
								<Text
									style={[
										styles.filterText,
										activeFilter === filter &&
										styles.activeFilterText,
									]}
								>
									{filter}
								</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>

				<View style={styles.cardsGrid}>
					{filteredCards.map((card) => {
						const isInWishlist = wishlistCards.some(
							(item) => item.id === card.id
						);

						return (
							<View key={card.id} style={styles.card}>
								<Pressable
									onPress={() => setSelectedCard(card)}
									accessibilityRole="button"
									accessibilityLabel={`View ${card.name}`}
									style={styles.imageContainer}
								>
									<Image
										source={{
											uri:
												card.imageUris?.grid ??
												card.imageUris?.normal ??
												undefined,
										}}
										style={styles.cardImage}
										contentFit="cover"
									/>

									<View style={styles.expandIcon}>
										<Ionicons
											name="expand-outline"
											size={18}
											color="#FFFFFF"
										/>
									</View>
								</Pressable>

								<View style={styles.cardInfo}>
									<Text
										style={styles.cardName}
										numberOfLines={2}
									>
										{card.name}
									</Text>

									<Text style={styles.cardSetName} numberOfLines={2}>
										{card.setName || "Set information unavailable"}
									</Text>

									{/* Price on the left, + on the right */}
									<View style={styles.cardPriceRow}>
										<View>
											<Text style={styles.cardPriceLabel}>PRICE</Text>
											{/* TODO: show the real AUD price once cards have one */}
											<Text style={styles.cardPrice}>—</Text>
										</View>

										<Menu
											visible={menuCardId === card.id}
											onDismiss={closeMenu}
											anchorPosition="bottom"
											contentStyle={styles.menu}
											anchor={
												<Pressable
													onPress={() => setMenuCardId(card.id)}
													accessibilityRole="button"
													accessibilityLabel={`Add ${card.name} to…`}
													hitSlop={4}
													style={[
														styles.addButton,
														menuCardId === card.id && styles.addButtonActive,
													]}
												>
													<Ionicons
														name="add"
														size={22}
														color={menuCardId === card.id ? "#E2D7BD" : "#171717"}
													/>
												</Pressable>
											}
										>
											<Menu.Item
												leadingIcon={menuIcon(isInWishlist ? "heart" : "heart-outline")}
												title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
												titleStyle={styles.menuItemText}
												onPress={() => {
													toggleWishlist(card);
													closeMenu();
												}}
											/>
											<Menu.Item
												leadingIcon={menuIcon("pricetag-outline")}
												title="Add to my listings"
												titleStyle={styles.menuItemText}
												onPress={() => openSheet("listing", card)}
											/>
											<Menu.Item
												leadingIcon={menuIcon("albums-outline")}
												title="Add to collection"
												titleStyle={styles.menuItemText}
												onPress={() => openSheet("collection", card)}
											/>
											<View style={styles.menuDivider} />
											<Menu.Item
												leadingIcon={menuIcon("layers-outline")}
												title="Add to deck"
												titleStyle={styles.menuItemText}
												onPress={closeMenu}
											/>
										</Menu>
									</View>
								</View>
							</View>
						);
					})}
				</View>

				{pagination &&
					pagination.page < pagination.totalPages &&
					!loading &&
					!loadingMore && (
						<Pressable
							style={styles.loadMoreButton}
							onPress={loadMore}
						>
							<Text style={styles.loadMoreText}>Load More</Text>
						</Pressable>
					)}

				{loadingMore && (
					<ActivityIndicator
						style={{ marginVertical: 32 }}
						color="#171717"
					/>
				)}

				{loading && (
					<ActivityIndicator
						style={{ marginVertical: 32 }}
						color="#171717"
					/>
				)}

				{error && !loading && (
					<View style={styles.emptyState}>
						<Ionicons
							name="alert-circle-outline"
							size={36}
							color="#77705F"
						/>
						<Text style={styles.emptyTitle}>
							Something went wrong
						</Text>
						<Text style={styles.emptyText}>{error}</Text>
					</View>
				)}

				{!loading && !error && filteredCards.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons
							name="search-outline"
							size={36}
							color="#77705F"
						/>
						<Text style={styles.emptyTitle}>No cards found</Text>
						<Text style={styles.emptyText}>
							Try another search or category.
						</Text>
					</View>
				)}

				<View style={styles.footer}>
					<Text style={styles.footerText}>
						TCG HUB · YOUR NEXT TRADE STARTS HERE
					</Text>
				</View>
			</ScrollView>

			<Modal
				visible={selectedCard !== null}
				transparent
				animationType="fade"
				statusBarTranslucent
				navigationBarTranslucent
				onRequestClose={closePreview}
			>
				{selectedCard && (
					<View
						style={[
							styles.preview,
							{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
						]}
					>
						{/* While the menu is open, tapping anywhere else closes it */}
						{previewMenuOpen && (
							<Pressable
								style={styles.menuCatcher}
								onPress={() => setPreviewMenuOpen(false)}
								accessibilityRole="button"
								accessibilityLabel="Close menu"
							/>
						)}

						{/* Top: close button on the right */}
						<View style={styles.previewTopRow}>
							<Pressable
								style={styles.previewClose}
								onPress={closePreview}
								accessibilityRole="button"
								accessibilityLabel="Close preview"
							>
								<Ionicons name="close" size={22} color="#E2D7BD" />
							</Pressable>
						</View>

						{/* Middle: the card, as big as fits */}
						<View style={styles.previewImageArea}>
							<Image
								source={{
									uri:
										selectedCard.imageUris?.large ??
										selectedCard.imageUris?.normal ??
										selectedCard.imageUris?.grid ??
										undefined,
								}}
								style={styles.previewImage}
								contentFit="contain"
							/>
						</View>

						{/* Name and set */}
						<View style={styles.previewInfo}>
							<Text style={styles.previewName} numberOfLines={2}>
								{selectedCard.name}
							</Text>
							<Text style={styles.previewSetName} numberOfLines={1}>
								{selectedCard.setName || "Set information unavailable"}
							</Text>
						</View>

						{/* Bottom bar: price on the left, ADD TO on the right */}
						<View style={styles.previewBar}>
							<View>
								<Text style={styles.previewPriceLabel}>MARKET PRICE</Text>
								{/* TODO: show the real AUD price once cards have one */}
								<Text style={styles.previewPrice} accessibilityLabel="Price not available yet">
									—
								</Text>
							</View>

							<Pressable
								onPress={() => setPreviewMenuOpen((open) => !open)}
								accessibilityRole="button"
								accessibilityLabel={`Add ${selectedCard.name} to…`}
								accessibilityState={{ expanded: previewMenuOpen }}
								style={[
									styles.previewAddButton,
									previewMenuOpen && styles.previewAddButtonActive,
								]}
							>
								<Ionicons name="add" size={20} color="#FFFFFF" />
								<Text style={styles.previewAddText}>ADD TO</Text>
							</Pressable>

							{/* Same items as the grid menu, drawn ourselves because Paper's <Menu> can't show inside a Modal */}
							{previewMenuOpen && (
								<View style={[styles.menu, styles.previewMenu]}>
									<Menu.Item
										leadingIcon={menuIcon(selectedInWishlist ? "heart" : "heart-outline")}
										title={selectedInWishlist ? "Remove from wishlist" : "Add to wishlist"}
										titleStyle={styles.menuItemText}
										onPress={() => {
											toggleWishlist(selectedCard);
											setPreviewMenuOpen(false);
										}}
									/>
									<Menu.Item
										leadingIcon={menuIcon("pricetag-outline")}
										title="Add to my listings"
										titleStyle={styles.menuItemText}
										onPress={() => openSheet("listing", selectedCard)}
									/>
									<Menu.Item
										leadingIcon={menuIcon("albums-outline")}
										title="Add to collection"
										titleStyle={styles.menuItemText}
										onPress={() => openSheet("collection", selectedCard)}
									/>
									<View style={styles.menuDivider} />
									<Menu.Item
										leadingIcon={menuIcon("layers-outline")}
										title="Add to deck"
										titleStyle={styles.menuItemText}
										onPress={() => setPreviewMenuOpen(false)}
									/>
								</View>
							)}
						</View>

						{/* From the fullscreen view: the panel has to be inside this Modal on iOS */}
						{sheetPanel}
					</View>
				)}
			</Modal>

			{/* From the grid: show the panel normally */}
			{!selectedCard && sheetPanel}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E2D7BD",
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 32,
	},
	header: {
		marginBottom: 22,
	},
	eyebrow: {
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 2,
		color: "#77705F",
		marginBottom: 8,
	},
	title: {
		fontSize: 34,
		fontWeight: "900",
		color: "#171717",
		letterSpacing: 0.5,
	},
	subtitle: {
		fontSize: 14,
		color: "#5F594D",
		marginTop: 6,
	},
	searchBar: {
		height: 48,
		borderRadius: 12,
		backgroundColor: "#F4ECDD",
		borderWidth: 1,
		borderColor: "#C9BDA3",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		gap: 10,
		marginBottom: 20,
	},
	searchInput: {
		flex: 1,
		height: 48,
		backgroundColor: "transparent",
	},
	searchInputContent: {
		paddingHorizontal: 0,
		fontSize: 14,
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
		backgroundColor: "#F4ECDD",
		borderWidth: 1,
		borderColor: "#C9BDA3",
	},
	activeFilterButton: {
		backgroundColor: "#171717",
		borderColor: "#171717",
	},
	filterText: {
		fontSize: 13,
		fontWeight: "600",
		color: "#514B40",
	},
	activeFilterText: {
		color: "#E2D7BD",
	},
	cardsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		rowGap: 22,
	},
	card: {
		width: "48%",
		overflow: "hidden",
		borderRadius: 14,
		backgroundColor: "#F4ECDD",
		borderWidth: 1,
		borderColor: "#C9BDA3",
	},
	imageContainer: {
		position: "relative",
		width: "100%",
		aspectRatio: 0.72,
		backgroundColor: "#D1C4A8",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
	expandIcon: {
		position: "absolute",
		right: 8,
		bottom: 8,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "rgba(23, 23, 23, 0.8)",
		alignItems: "center",
		justifyContent: "center",
	},
	cardInfo: {
		flex: 1,
		paddingHorizontal: 11,
		paddingVertical: 12,
	},
	cardName: {
		fontSize: 15,
		fontWeight: "800",
		color: "#171717",
	},
	cardPriceRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 6,
		marginTop: "auto",
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#DCCFB3",
	},
	cardPriceLabel: {
		fontSize: 10,
		fontWeight: "700",
		letterSpacing: 1,
		color: "#77705F",
	},
	cardPrice: {
		fontFamily: "BarlowCondensed_700Bold",
		fontSize: 19,
		color: "#171717",
	},
	addButton: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: "#E2D7BD",
		alignItems: "center",
		justifyContent: "center",
	},
	addButtonActive: {
		backgroundColor: "#171717",
	},
	menu: {
		backgroundColor: "#FBF7EE",
		borderRadius: 14,
	},
	menuItemText: {
		fontSize: 15,
		color: "#171717",
	},
	menuDivider: {
		height: 1,
		marginHorizontal: 12,
		marginVertical: 4,
		backgroundColor: "#DCCFB3",
	},
	cardSetName: {
		fontSize: 11,
		color: "#77705F",
		marginTop: 5,
	},
	loadMoreButton: {
		alignSelf: "center",
		marginTop: 28,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 20,
		backgroundColor: "#171717",
	},
	loadMoreText: {
		color: "#E2D7BD",
		fontSize: 13,
		fontWeight: "700",
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: 48,
		gap: 10,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "800",
		color: "#171717",
	},
	emptyText: {
		fontSize: 13,
		color: "#77705F",
	},
	footer: {
		marginTop: 30,
		alignItems: "center",
	},
	footerText: {
		fontSize: 10,
		fontWeight: "700",
		letterSpacing: 1.3,
		color: "#77705F",
		textAlign: "center",
	},
	preview: {
		flex: 1,
		paddingHorizontal: 20,
		backgroundColor: "#171717",
	},
	menuCatcher: {
		...StyleSheet.absoluteFill,
	},
	previewTopRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	previewClose: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "#2C2A26",
		alignItems: "center",
		justifyContent: "center",
	},
	previewImageArea: {
		flex: 1,
		paddingVertical: 12,
	},
	previewImage: {
		width: "100%",
		height: "100%",
	},
	previewInfo: {
		paddingHorizontal: 4,
		marginBottom: 16,
	},
	previewName: {
		fontFamily: "BarlowCondensed_700Bold",
		fontSize: 28,
		letterSpacing: 1,
		textTransform: "uppercase",
		color: "#F4EEDF",
	},
	previewSetName: {
		marginTop: 2,
		fontSize: 14,
		color: "#A79E8B",
	},
	previewBar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
		paddingVertical: 14,
		paddingLeft: 18,
		paddingRight: 14,
		borderRadius: 18,
		backgroundColor: "#E2D7BD",
	},
	previewPriceLabel: {
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 1.2,
		color: "#5A5246",
	},
	previewPrice: {
		fontFamily: "BarlowCondensed_700Bold",
		fontSize: 30,
		color: "#171717",
	},
	previewAddButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		height: 52,
		paddingLeft: 16,
		paddingRight: 20,
		borderRadius: 14,
		backgroundColor: "#2e7d32",
	},
	previewAddButtonActive: {
		backgroundColor: "#171717",
	},
	previewAddText: {
		fontFamily: "BarlowCondensed_700Bold",
		fontSize: 18,
		letterSpacing: 1.2,
		color: "#FFFFFF",
	},
	previewMenu: {
		position: "absolute",
		right: 0,
		bottom: "100%",
		marginBottom: 10,
		width: 250,
		paddingVertical: 6,
		boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
	},
});
