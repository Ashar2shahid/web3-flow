import { EdgeType } from "@/types";




export interface BranchEdgeData {
  type: EdgeType.BRIDGE;
}

export interface AnotherEdgeData {
  type: Exclude<EdgeType, EdgeType.BRIDGE>;
}

export type EdgeData = BranchEdgeData | AnotherEdgeData;
