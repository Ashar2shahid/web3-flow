import { EdgeType, NavItem, NodeType } from '@/types';
import { camelCase } from 'lodash';
import { nanoid } from 'nanoid';
import { Edge, Node, NodeProps, useReactFlow } from 'reactflow';

// this hook implements the logic for clicking a placeholder node
// on placeholder node click: turn the placeholder and connecting edge into a workflow node
export function usePlaceholderClick() {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const onFloatNodeClick = (id: NodeProps['id'], item: NavItem) => {
    // we need the parent node object for getting its position
    const parentNode = getNode(id);

    if (!parentNode) {
      return;
    }

    // Function to create a floating node with a given label
    const createFloatingNode = (
      label: string,
      offsetX: number,
      offsetY: number,
      parentId: string
    ) => ({
      id: nanoid(),
      position: {
        x: parentNode.position.x + offsetX,
        y: parentNode.position.y + offsetY,
      },
      type: NodeType.FLOAT,
      data: { label, parentId },
    });

    // Check if the node type is condition and create 'Yes' and 'No' nodes if so
    let additionalNodes: Node[] = [];
    let additionalEdges: Edge[] = [];
    if (camelCase(item.name) === NodeType.CONDITION) {
      const yesNode = createFloatingNode('Yes', 100, -50, parentNode.id);
      const noNode = createFloatingNode('No', 100, 50, parentNode.id);

      additionalNodes = [yesNode, noNode];
      additionalEdges = [
        {
          id: `${parentNode.id}=>${yesNode.id}`,
          source: parentNode.id,
          target: yesNode.id,
          data: { label: 'Yes' },
          type: EdgeType.CUSTOM,
        },
        {
          id: `${parentNode.id}=>${noNode.id}`,
          source: parentNode.id,
          target: noNode.id,
          data: { label: 'No' },
          type: EdgeType.CUSTOM,
        },
      ];
    } else {
      // create a unique id for the placeholder node that will be added as a child of the clicked node
      const childFloatId = nanoid();

      // create a placeholder node that will be added as a child of the clicked node
      const childFloatNode = {
        id: childFloatId,
        // the placeholder is placed at the position of the clicked node
        // the layout function will animate it to its new position
        position: { x: parentNode.position.x, y: parentNode.position.y },
        type: NodeType.FLOAT,
        data: { label: '+', parentId: parentNode.id },
      };

      // we need a connection from the clicked node to the new placeholder
      const childFloatEdge = {
        id: `${parentNode.id}=>${childFloatId}`,
        source: parentNode.id,
        target: childFloatId,
        data: { lebel: parentNode?.data?.label, icon: parentNode?.data?.icon },
        type: EdgeType.DEFAULT,
      };

      additionalNodes = [childFloatNode];
      additionalEdges = [childFloatEdge];
    }

    setNodes(nodes =>
      nodes
        .map(node => {
          // here we are changing the type of the clicked node from placeholder to workflow
          if (node.id === id) {
            return {
              ...node,
              type: camelCase(item.name),
              data: { label: item.name },
            };
          }
          return node;
        })
        // add the new nodes
        .concat(additionalNodes)
    );

    setEdges(edges =>
      edges
        .map(edge => {
          // here we are changing the type of the connecting edge from placeholder to workflow
          if (edge.target === id) {
            return {
              ...edge,
              type:
                edge?.data?.label === 'Yes' || 'No'
                  ? EdgeType.CUSTOM
                  : EdgeType.BRIDGE,
              data: {
                label: edge.data?.label,
                icon: '+',
              },
            };
          }
          return edge;
        })
        // add the new edges
        .concat(additionalEdges)
    );
  };

  return { onFloatNodeClick };
}

export default usePlaceholderClick;
