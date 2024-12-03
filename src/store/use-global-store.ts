
import { create } from 'zustand';

interface PropertyStore {
  isDragOn: boolean;
  setDragOn: (isDragOn: boolean) => void;
}

export const useGlobalStore = create<PropertyStore>(set => ({
  isDragOn: false,

  setDragOn: show => set({ isDragOn: show }),
}));
