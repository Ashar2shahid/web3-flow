// import { NodeProperties } from "@/components/layouts";

import { DrawerAction } from "@/configs";
import { EdgeData } from "@/data/EdgeData";
import { NodeDataType, OnboardingAction } from "@/data/NodeData";

import { EdgeType, NodeType } from "@/types";
import { nanoid } from "nanoid";
import { Edge, Node } from "reactflow";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export enum NodeAction {
  SWAP = "swap",
}
const startNodeUUID = nanoid();
const nextNodeUUID = nanoid();
const initialNodes: Node[] = [
  {
    id: startNodeUUID,
    type: NodeType.START,
    data: {},
    position: { x: 0, y: 0 },
  }
];
const initialEdges: Edge<EdgeData>[] = [
  {
    id: `e${startNodeUUID}-${nextNodeUUID}`,
    type: EdgeType.BRIDGE,
    source: startNodeUUID,
    target: nextNodeUUID,
  },
];

export interface SwapDragAction {
  type: NodeAction.SWAP;
  nodeId: string;
}

export interface OnboardingDragAction {
  type: OnboardingAction;
  targetId?: string;
}

export type DragAction = DrawerAction | SwapDragAction | OnboardingDragAction;
export interface IDiagram {
  nodes: Node[];
  edges: Edge[];
}
export interface DiagramStore {
  default: string;
  diagram: IDiagram;
  setDefault: (name: string) => void;
  loadDiagram: (payload: DiagramStore["diagram"]) => void;

  setNodes: (action: Node<NodeDataType>[]) => void;


  setEdges: (payload: Edge<EdgeData>[]) => void;
}

export const useDiagramStore = create(
  persist<DiagramStore>(
    (set) => ({
      default: "",

      diagram: {
        nodes: initialNodes.slice(),
        edges: initialEdges.slice(),
      },
      loadDiagram: (payload: DiagramStore["diagram"]) =>
        set((state) => ({ ...state, diagram: payload })),
      setDefault: (name: string) =>
        set((state) => ({ ...state, default: name })),
      setNodes: (action: Node<NodeDataType>[]) => {
        set((state) => ({
        
          diagram:{
           ...state.diagram,
           nodes:action
          }
          
        }));
      },

      setEdges(payload) {
        set((state) => {
          return {
            ...state,
            diagram: {
              ...state.diagram,
              edges: payload,
            },
           
          };
        });
      },
    }),
    { name: "diagram-store" }
  )
);
