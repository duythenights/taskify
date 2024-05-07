import { create } from "zustand";

type CardModelStore = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
};

export const useCardModel = create<CardModelStore>((set) => ({
    id: undefined,
    isOpen: false,
    onClose: () => set({ isOpen: false, id: undefined }),
    onOpen: (id: string) => set({ isOpen: true, id }),
}));
