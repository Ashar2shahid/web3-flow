import { useCallback, useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import { useReactFlow, useNodesInitialized, Node, Edge } from "reactflow";
import { debounce } from "lodash";

const options = {
  includeHiddenNodes: false,
};

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.unnecessaryBendpoints": "true",
  "elk.hierarchyHandling": "INCLUDE_CHILDREN",
  "elk.layered.spacing.edgeNodeBetweenLayers": "10",
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
  "elk.insideSelfLoops.activate": "true",
  'elk.layered.considerModelOrder.strategy': 'NODES',
  separateConnectedComponents: "false",
  "spacing.componentComponent": "50",
  spacing: "50",
  "elk.layered.spacing.nodeNodeBetweenLayers": "20",
};

const elk = new ELK();

export const getLayoutedNodes = async (nodes: Node[], edges: Edge[]): Promise<Node[]> => {
  const nodeIds = nodes.map((n) => n.id);

  // Filter out any edges that reference nodes that do not exist
  const validEdges = edges.filter((e) => nodeIds.includes(e.source) && nodeIds.includes(e.target));

  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((n) => ({
      id: n.id,
      width: 400,
      height: n.type !== "float" ? n.data?.isCollapsed  ? 300 : 200  : 120,
      layoutOptions: {
        "portAlignment.default": "CENTER",
        'org.eclipse.elk.portConstraints': 'FIXED_ORDER',
      },
    })),
    edges: validEdges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find(
      (lgNode) => lgNode.id === node.id
    );
    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? node.position.x,
        y: layoutedNode?.y ?? node.position.y,
      },
    
      transition: "transform 0.8s ease", // Add transition for smooth animation
    };
  });

  return layoutedNodes;
};

export default function useLayoutNodes() {

  console.log("elfk layout")
  const nodesInitialized = useNodesInitialized(options);
  const { getNodes, getEdges, setNodes } = useReactFlow();

  const applyAutoLayoutDebounced = useCallback(
    debounce(async () => {
      const layoutedNodes = await getLayoutedNodes(getNodes(), getEdges());
      setNodes(() => layoutedNodes);
    }, 10), // Debounce delay to prevent excessive calculations
    [getNodes, getEdges, setNodes]
  );

  useEffect(() => {
    if (nodesInitialized) {
      applyAutoLayoutDebounced();
    }
  }, [nodesInitialized, applyAutoLayoutDebounced]);

  useEffect(() => {
    return () => {
      applyAutoLayoutDebounced.cancel();
    };
  }, [applyAutoLayoutDebounced]);

  return { applyAutoLayout: applyAutoLayoutDebounced };
}