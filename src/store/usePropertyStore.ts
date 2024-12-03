

import { NodeProperties } from "@/data/NodeData";
import { Node } from "reactflow";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PropertyStore {
  showProperty: boolean;
  properties: NodeProperties | null;
  setShowProperty: (show: boolean) => void;
  setProperties: (properties: NodeProperties | null | undefined) => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  showProperty: false,
  properties: null,
  setShowProperty: (show) => set({ showProperty: show }),
  setProperties: (properties) => set({ properties: properties }),
}));
