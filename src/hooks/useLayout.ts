import { NodeType } from '@/types';
import { stratify, tree } from 'd3-hierarchy';
import { timer } from 'd3-timer';
import { useEffect, useRef } from 'react';
import type { Edge, Node, ReactFlowState } from 'reactflow';
import { useReactFlow, useStore } from 'reactflow';

const layout = tree<Node>()
  .nodeSize([600, 350])
  .separation(() => 1);

const options = { duration: 300 };

function layoutNodes(nodes: Node[], edges: Edge[]): Node[] {
  const connectedNodeIds = new Set(edges.flatMap(e => [e.source, e.target]));
  const connectedNodes = nodes.filter(node => connectedNodeIds.has(node.id));

  // Early return if no connected nodes
  if (connectedNodes.length === 0) {
    return nodes.map(node => ({
      ...node,
      position: node.position || { x: 0, y: 0 },
    }));
  }

  try {
    const hierarchy = stratify<Node>()
      .id(d => d.id)
      .parentId((d: Node) => edges.find(e => e.target === d.id)?.source)(
      connectedNodes
    );

    const root = layout(hierarchy);

    const layoutedNodes = root.descendants().map(d => {
      return {
        ...d.data,
        position: {
          x: d.x,
          y:
            d.data.type === NodeType.FLOAT &&
            d.parent?.data.type === NodeType.START
              ? d.y - 100
              : d.data.type === NodeType.FLOAT
              ? d.y + 40
              : d.y + 20,
        },
      };
    });

    const disconnectedNodes = nodes.filter(
      node => !connectedNodeIds.has(node.id)
    );
    const allNodes = [...layoutedNodes, ...disconnectedNodes];

    return allNodes;
  } catch (error) {
    console.error('Error creating hierarchy:', error);
    return nodes.map(node => ({
      ...node,
      position: node.position || { x: 0, y: 0 },
    }));
  }
}

const nodeCountSelector = (state: ReactFlowState) => state.nodeInternals.size;

function useLayout(nodes: Node[], edges: Edge[]) {
  const initial = useRef(true);
  const nodeCount = useStore(nodeCountSelector);

  const { getNodes, getNode, setNodes, fitView } = useReactFlow();

  useEffect(() => {
    const targetNodes = layoutNodes(nodes, edges);

    const transitions = targetNodes.map(node => ({
      id: node.id,
      from: getNode(node.id)?.position || node.position,
      to: node.position,
      node,
    }));

    const t = timer((elapsed: number) => {
      const s = elapsed / options.duration;

      const currNodes = transitions.map(({ node, from, to }) => ({
        id: node.id,
        position: {
          x: from.x + (to.x - from.x) * s,
          y: from.y + (to.y - from.y) * s,
        },
        data: { ...node.data },
        type: node.type,
      }));

      setNodes(currNodes);

      if (elapsed > options.duration) {
        const finalNodes = transitions.map(({ node, to }) => ({
          id: node.id,
          position: {
            x: to.x,
            y: to.y,
          },
          data: { ...node.data },
          type: node.type,
        }));

        setNodes(finalNodes);
        t.stop();

        if (!initial.current) {
          fitView({ duration: 200 });
        }
        initial.current = false;
      }
    });

    return () => {
      t.stop();
    };
  }, [nodeCount, getNodes, getNode, setNodes, fitView]);
}

export default useLayout;
