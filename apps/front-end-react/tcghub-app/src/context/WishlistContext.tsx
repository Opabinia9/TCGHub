import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { MagicCard } from "@/api/cards";

type WishlistContextType = {
    wishlistCards: MagicCard[];
    toggleWishlist: (card: MagicCard) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
    undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistCards, setWishlistCards] = useState<MagicCard[]>([]);

    const toggleWishlist = (card: MagicCard) => {
        setWishlistCards((currentCards) =>
            currentCards.some((item) => item.id === card.id)
                ? currentCards.filter((item) => item.id !== card.id)
                : [...currentCards, card]
        );
    };

    return (
        <WishlistContext.Provider value={{ wishlistCards, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error("useWishlist must be used inside WishlistProvider");
    }

    return context;
}