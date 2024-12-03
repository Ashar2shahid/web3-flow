"use client";
import { DrawerAction } from "@/configs";
import { EdgeData } from "@/data/EdgeData";
import { OnboardingAction } from "@/data/NodeData";
import { useFlow } from "@/hooks/useFlow";
import { EdgeTypes, NodeData, NodeType } from "@/types";
import { RefObject, FC, useEffect } from "react";
import { useViewport, Edge, getOutgoers, Node } from "reactflow";

export enum NodeAction {
  SWAP = "swap",
}

interface NodeDraggingProviderProps {
  flowRef: RefObject<HTMLDivElement>;
}

const MAXIMUM_INSERT_RADIUS = 130;

export const dragActionsNotToDoBetweenNodes: (
  | DrawerAction
  | NodeAction
  | OnboardingAction
  | undefined
)[] = [DrawerAction.TIME_DELAY, DrawerAction.UPDATE_PROFILE];

const NodeDraggingProvider: FC<NodeDraggingProviderProps> = ({ flowRef }) => {
  const { edges, nodes } = useFlow();

  const { x: viewX, y: viewY, zoom } = useViewport();

  const onDragOver = (e: DragEvent) => {
    e.stopPropagation();
    if (!flowRef.current || edges.length === 0) return;

    const boudingClientRect = flowRef.current.getBoundingClientRect();

    const canvasMouseX = (e.clientX - viewX - boudingClientRect.left) / zoom;
    const canvasMouseY = (e.clientY - viewY - boudingClientRect.top) / zoom;

    const insertNode = nodes.find((node) => node.type === NodeType.INSERT_NODE);

    if (insertNode && e.dataTransfer) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }

    let lengthToInsertNode = insertNode
      ? Math.sqrt(
          (canvasMouseX - insertNode.position.x) *
            (canvasMouseX - insertNode.position.x) +
            (canvasMouseY - insertNode.position.y) *
              (canvasMouseY - insertNode.position.y)
        )
      : Infinity;

    if (lengthToInsertNode > MAXIMUM_INSERT_RADIUS) {
      // clearInsertNodes();
      lengthToInsertNode = Infinity;
    }

    let closestEdge:
      | {
          edge: Edge<EdgeData>;
          lengthToLabel: number;
          nodeA: Node<NodeData>;
          nodeB: Node<NodeData>;
        }
      | undefined;

    for (const edge of edges) {
      if (edge.type !== EdgeTypes.bridge) continue;

      const nodeA = nodes.find((node) => node.id === edge.source);
      const nodeB = nodes.find((node) => node.id === edge.target);

      if (
        !nodeA?.type ||
        !nodeB?.type ||
        ([NodeType.EMPTY, NodeType.INSERT_NODE] as string[]).includes(
          nodeA.type
        ) ||
        ([NodeType.EMPTY, NodeType.INSERT_NODE] as string[]).includes(
          nodeB.type
        )
      )
        continue;

      const labelX = (nodeA.position.x + nodeB.position.x) / 2;
      const labelY = (nodeA.position.y + nodeB.position.y) / 2;

      const lengthToLabel = Math.sqrt(
        (canvasMouseX - labelX) * (canvasMouseX - labelX) +
          (canvasMouseY - labelY) * (canvasMouseY - labelY)
      );

      if (lengthToLabel > 50) continue;

      if (!closestEdge || lengthToLabel < closestEdge.lengthToLabel)
        closestEdge = { edge, lengthToLabel, nodeA, nodeB };
    }

    let closestEmptyNode: { node: Node<NodeData>; length: number } | undefined;

    // for (const node of nodes) {
    //   if (node.type !== NodeType.EMPTY) continue;

    //   const length = Math.sqrt(
    //     (canvasMouseX - node.position.x) * (canvasMouseX - node.position.x) +
    //       (canvasMouseY - node.position.y) * (canvasMouseY - node.position.y)
    //   );

    //   if (length > MAXIMUM_INSERT_RADIUS) continue;

    //   if (!closestEmptyNode || closestEmptyNode.length > length)
    //     closestEmptyNode = { node, length };
    // }

    if (
      closestEmptyNode &&
      (!closestEdge || closestEmptyNode.length < closestEdge.lengthToLabel) &&
      closestEmptyNode.length < lengthToInsertNode
    ) {
      // transformEmptyNodeIntoInsertNode(closestEmptyNode.node.id);
      return;
    }

    if (!closestEdge || closestEdge.lengthToLabel > lengthToInsertNode) return;

    // addInsertNodeBetween(closestEdge.nodeA.id, closestEdge.nodeB.id);
  };

  const onDrop = (e: DragEvent) => {
    const insertNode = nodes.find((node) => node.type === NodeType.INSERT_NODE);
    const action = e.dataTransfer?.getData("action");

    if (
      !insertNode ||
      !action ||
      (action === DrawerAction.EXIT &&
        getOutgoers(insertNode, nodes, edges).length > 0)
    )
      return;

    // transformInsertNodeIntoEmptyNode(insertNode.id);

    try {
      // handleDrawerAction({ id: insertNode.id, action });
    } catch (error) {
      // removeNode(insertNode.id);
    }
  };

  useEffect(() => {
    if (!flowRef.current) return;

    flowRef.current.addEventListener("dragover", onDragOver);
    flowRef.current.addEventListener("drop", onDrop);

    return () => {
      flowRef.current?.removeEventListener("dragover", onDragOver);
      flowRef.current?.removeEventListener("drop", onDrop);
    };
  }, [flowRef.current, nodes, edges]);

  return <></>;
};

export default NodeDraggingProvider;
