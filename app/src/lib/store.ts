import { create } from "zustand";

interface GroupCache {
  address: string;
  description: string;
  creator: string;
  monthlyContribution: number;
  totalMembers: number;
  currentMembers: number;
  status: string;
  currentRound: number;
}

interface PoolverStore {
  // Cached data
  groups: Map<string, GroupCache>;

  // UI state
  isPaymentModalOpen: boolean;
  selectedGroupAddress: string | null;

  // Actions
  setGroup: (address: string, data: GroupCache) => void;
  setGroups: (groups: GroupCache[]) => void;
  setPaymentModalOpen: (open: boolean) => void;
  setSelectedGroup: (address: string | null) => void;
  clearCache: () => void;
}

export const usePoolverStore = create<PoolverStore>((set) => ({
  groups: new Map(),
  isPaymentModalOpen: false,
  selectedGroupAddress: null,

  setGroup: (address, data) =>
    set((state) => {
      const groups = new Map(state.groups);
      groups.set(address, data);
      return { groups };
    }),

  setGroups: (groups) =>
    set(() => {
      const map = new Map<string, GroupCache>();
      groups.forEach((g) => map.set(g.address, g));
      return { groups: map };
    }),

  setPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),
  setSelectedGroup: (address) => set({ selectedGroupAddress: address }),
  clearCache: () => set({ groups: new Map() }),
}));
