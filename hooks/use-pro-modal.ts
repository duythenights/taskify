import { create } from "zustand";

type ProModalStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useProModal = create<ProModalStore>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
}));
