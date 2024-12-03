import { Edge, EdgeProps, MarkerType, Node, useReactFlow } from 'reactflow';
import { nanoid } from 'nanoid';
import { without, isArray } from 'lodash';
import { EdgeType, NodeType } from '@/types';


// this hook implements the logic for clicking the button on a workflow edge
// on edge click: create a node in between the two nodes that are connected by the edge
export function useEdgeClick(id: EdgeProps['id']) {
  const { setEdges, setNodes, getNode, getEdge } = useReactFlow();

  const handleEdgeClick = (label: string, type: NodeType) => {
    // first we retrieve the edge object to get the source and target id
    const edge = getEdge(id);

    if (!edge) {
      return;
    }

    // we retrieve the target node to get its position
    const targetNode: any = getNode(edge.target);
    const sourceNode: any = getNode(edge.source);
    console.log({ targetNode, sourceNode, edge, type });

    if (!targetNode || !sourceNode) {
      return;
    }

    // create a unique id for newly added elements
    const insertNodeId = `${nanoid()}_${type}`;

    // this is the node object that will be added in between source and target node
    const insertNode: Node = {
      id: insertNodeId,
      // we place the node at the current position of the target (prevents jumping)
      position: { x: targetNode.position.x, y: targetNode.position.y },
      data: { label, prev: [sourceNode.id], next: targetNode.id ,isCollapsed:true },
      type,
      draggable: true,
    };

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === sourceNode.id && ![NodeType.CONDITION].includes(sourceNode.type as NodeType)) {
          const node = {
            ...n,
            data: {
              ...n.data,
              isCollapsed:true ,
              next: insertNodeId,
            },
          };
          return node;
        }

        if (n.id === targetNode.id) {
          return {
            ...n,
            data: {
              ...n.data,
              prev: [
                ...without(n.data.prev || [], sourceNode.id),
                insertNodeId,
              ],
            },
          };
        }
        return n;
      })
    );

    if ([NodeType.CONDITION].includes(sourceNode.type as NodeType)) {
      console.log({ sourceNode: sourceNode.type });
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === sourceNode.id) {
            return {
              ...n,
              data: {
                ...n.data,
                isCollapsed:true ,
                children: isArray(n.data.children) ? [...n.data.children, insertNodeId] : [insertNodeId],
              },
            };
          }
          return n;
        })
      );

      insertNode.data.parentNode = sourceNode.id;

    } else if (sourceNode.data.parentNode) {
      insertNode.data.parentNode = sourceNode.data.parentNode;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === sourceNode.data.parentNode) {
            return {
              ...n,
              data: {
                ...n.data,
                isCollapsed:true ,
                children: isArray(n.data.children) ? [...n.data.children, insertNodeId] : [insertNodeId],
              },
            };
          }
          return n;
        })
      );
    }

    const addEdgesNewNodeToNextNode: Edge[] = [];
  console.log({edge})
    const addEdgePrevNodeToNewNode: Edge = {
      id: `${edge.source}->${insertNodeId}${edge?.sourceHandle ? `->${edge.sourceHandle}` : ''}`,
      source: edge.source,
      target: insertNodeId,
      data: {
        label: edge?.data?.label,
        icon:"+"
      },
      sourceHandle: edge.sourceHandle,
      type: EdgeType.CUSTOM,
    };

    if (type === NodeType.CONDITION) {
      // Reuse the existing bottom node for the "Yes" edge
      const yesEdgeTargetNode = targetNode;
        yesEdgeTargetNode.position.x = targetNode.position.x + 100;
        yesEdgeTargetNode.position.y = targetNode.position.y - 50;
      const newfloatNode2 = {
        id: nanoid(),
        type: NodeType.FLOAT,
        position: {
          x: insertNode.position.x + 100,
          y: insertNode.position.y + 50,
        },
        data: { label: 'Yes',parentId: insertNodeId },
      };
      const addNewEdge1: Edge = {
        id: nanoid(),
        source: insertNodeId,
        target: yesEdgeTargetNode.id,
        type: EdgeType.CUSTOM,
        data: {
          label: 'Yes',
          icon:"+"
        },
        style: { stroke: 'black', strokeWidth: '1.3' },
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
      };


      const addNewEdge2: Edge = {
        id: `${insertNodeId}->${yesEdgeTargetNode.id}`,
        source: insertNodeId,
        target: newfloatNode2.id,
        type: EdgeType.CUSTOM,
        data: {
          label: 'No'
        },
        style: { stroke: 'black', strokeWidth: '1.3' },
        labelBgBorderRadius: 4,
        markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
      };
      
      setNodes((nds: Node[]) => nds.concat(newfloatNode2));

      setEdges((edges) => {
        const targetEdgeIndex = edges.findIndex((e) => e.id === id);
        return [
          ...edges.slice(0, targetEdgeIndex),
          addEdgePrevNodeToNewNode,
          addNewEdge1,
          addNewEdge2,
          ...edges.slice(targetEdgeIndex, edges.length),
        ].filter((e) => e.id !== id);
      });

      setNodes((nodes) => {
        const targetNodeIndex = nodes.findIndex((node) => node.id === edge.target);

        return [
          ...nodes.slice(0, targetNodeIndex),
          insertNode,
          newfloatNode2,
          ...nodes.slice(targetNodeIndex, nodes.length),
        ];
      });
    } else {
      addEdgesNewNodeToNextNode.push({
        id: `${insertNodeId}->${edge.target}`,
        source: insertNodeId,
        target: edge.target,
        type: 'bridge',
      });

      setEdges((edges) => {
        const targetEdgeIndex = edges.findIndex((e) => e.id === id);
        return [
          ...edges.slice(0, targetEdgeIndex),
          addEdgePrevNodeToNewNode,
          ...addEdgesNewNodeToNextNode,
          ...edges.slice(targetEdgeIndex, edges.length),
        ].filter((e) => e.id !== id);
      });

      setNodes((nodes) => {
        const targetNodeIndex = nodes.findIndex((node) => node.id === edge.target);

        return [
          ...nodes.slice(0, targetNodeIndex),
          insertNode,
          ...nodes.slice(targetNodeIndex, nodes.length),
        ];
      });
    }
  };

  return handleEdgeClick;
}
