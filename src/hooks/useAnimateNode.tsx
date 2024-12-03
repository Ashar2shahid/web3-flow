import { useEffect, useState } from "react";
import { Node, useReactFlow } from "reactflow";
import { timer } from "d3-timer";

export type UseAnimatedNodeOptions = {
  animationDuration?: number;
};

export function useAnimatedNodes(
  nodes: any[],
  { animationDuration = 300 }: UseAnimatedNodeOptions = {}
) {
  const [tmpNodes, setTmpNodes] = useState(nodes);
  const { getNode } = useReactFlow();

  useEffect(() => {
    const transitions = nodes.map((node) => ({
      id: node?.id,
      from: getNode(node?.id)?.position ?? node?.position,
      to: node?.position,
      node,
    }));

    const t = timer((elapsed) => {
      const s = Math.min(1, elapsed / animationDuration);

      const currNodes = transitions.map(({ node, from, to }) => {
        return {
          ...node,
          position: {
            x: from?.x + (to?.x - from?.x) * s,
            y: from?.y + (to?.y - from?.y) * s,
          },
        };
      });

      setTmpNodes(currNodes);

      if (elapsed > animationDuration) {
        // Ensure we apply the final positions
        setTmpNodes(nodes);
        t.stop();
      }
    });

    return () => t.stop();
  }, [nodes, getNode, animationDuration]);

  return { nodes: tmpNodes };
}