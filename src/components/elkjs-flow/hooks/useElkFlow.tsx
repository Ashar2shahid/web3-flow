'use client';
import { useLocalStorage } from 'usehooks-ts';
import { nanoid } from 'nanoid';
import {
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Edge,
  MarkerType,
  Node,
  ReactFlowInstance,
  addEdge,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { snakeCase } from 'lodash';
import { HEADER_COLORS } from '@/styles';
import { useDiagramStore } from '@/store/useDiagramStore';
import { EdgeType, EdgeTypes, NodeType } from '@/types';
import { EdgeData } from '@/data/EdgeData';
import useElementSize from '@/hooks/useElementSize';
import { StartNode } from '../node/start/StartNode';
import { EmptyNode } from '../node/EmptyNode';
import FloatNode from '../node/float';
import { generatedNodeTypes } from '../config';
import { useGlobalStore } from '@/store/use-global-store';

const initialNodes: Node[] = [
  {
    id: 'start_1',
    type: NodeType.START,
    data: {},
    position: { x: 0, y: 0 },
  },
  {
    id: 'node-4',
    type: NodeType.FLOAT,
    position: { x: 0, y: 0 },
    data: {},
  },
];
const initialEdges: Edge<EdgeData>[] = [
  {
    id: 'edge-button',
    source: 'start_1',
    target: 'node-4',
    type: EdgeType.CUSTOM,
  },
];

export const useElkFlow = () => {
  const { default: defaultDiagram, diagram } = useDiagramStore();
  const {setDragOn}=useGlobalStore()
  const [diagrams, setDiagrams] = useLocalStorage('diagrams', {});
  console.log('elfk hooks');
  const [size, ref] = useElementSize();
  const { getNode, getEdges, getNodes } = useReactFlow();

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [edgeStyleType, setEdgeStyleType] = useState<string>(EdgeType.CUSTOM);
  const [diagramName, setDiagramName] = useState(defaultDiagram);
  const nodeTypes = useMemo(() => generatedNodeTypes, []);

  Object.assign(nodeTypes, {
    start: StartNode,
    empty: EmptyNode,
    float: FloatNode,
  });

  const onConnect = useCallback(
    (params: any) => {
      if (params.source === params.target) return;
      const prevNode: any = getNode(params.source);
      const getConnectedEdge = getConnectedEdges([prevNode], getEdges());

      const addNewEdge: Edge = {
        id: nanoid(10),
        source: params.source,
        target: params.target,
        type: 'bridge',
        labelBgBorderRadius: 4,
      };

      if (prevNode?.type === 'conditionalSplit') {
        const existYes = getConnectedEdge.findIndex(n => n.label === 'Yes');
        if (existYes === -1) {
          Object.assign(addNewEdge, { label: 'Yes' });
        } else {
          Object.assign(addNewEdge, { label: 'No' });
        }

        const existingYesNoEdges = getConnectedEdge.filter(
          el => el?.label === 'Yes' || el?.label === 'No'
        );
        if (existingYesNoEdges.length === 2) return;
      }

      setEdges((eds: Edge[]) => addEdge({ ...addNewEdge }, eds));
    },
    [setEdges, edgeStyleType]
  );

  useEffect(() => {
    const els = [...edges];
    const mapped = els.map(x => ({
      ...x,
      type: edgeStyleType,
    }));
    setEdges(mapped);
  }, [edgeStyleType]);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      setDragOn(true)
      const reactFlowBounds: any =
        reactFlowWrapper?.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      const targetId = event.target
        .closest('.react-flow__node')
        ?.getAttribute('data-id');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) return;

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (!position) return;

      const background = type
        ? HEADER_COLORS[snakeCase(type).toUpperCase()] || '#000'
        : '#000';

      const newNode = {
        id: nanoid(),
        type,
        position,
        data: { label, background, isCollapsed: true },
      };

      if (type === 'conditionalSplit') {
        const newfloatNode1 = {
          id: nanoid(),
          type: NodeType.FLOAT,
          position: { x: position.x - -176.875, y: position.y + 300 },
          data: { label, background, parentId: newNode.id, isCollapsed: false },
        };
        const newfloatNode2 = {
          id: nanoid(),
          type: NodeType.FLOAT,
          position: { x: position.x - 183.125, y: position.y + 300 },
          data: { label, background, parentId: newNode.id, isCollapsed: false },
        };
        const addNewEdge1: Edge = {
          id: nanoid(),
          source: newNode.id,
          target: newfloatNode1.id,
          type: EdgeType.CUSTOM,
          style: { stroke: 'black', strokeWidth: '1.3' },
          labelBgBorderRadius: 4,
          data: {
            label: 'No',
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
        };
        const addNewEdge2: Edge = {
          id: nanoid(),
          source: newNode.id,
          target: newfloatNode2.id,
          type: EdgeType.CUSTOM,
          style: { stroke: 'black', strokeWidth: '1.3' },
          data: {
            label: 'Yes',
          },
          labelBgBorderRadius: 4,
          markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
        };
        setNodes((nds: Node[]) => nds.concat(newfloatNode1));
        setNodes((nds: Node[]) => nds.concat(newfloatNode2));
        setEdges((nds: Edge[]) => nds.concat(addNewEdge1));
        setEdges((nds: Edge[]) => nds.concat(addNewEdge2));
      }

      if (targetId && newNode.id) {
        const addNewEdge: Edge = {
          id: nanoid(),
          source: targetId,
          target: newNode.id,
          type: EdgeTypes.bridge,
          style: { stroke: 'black', strokeWidth: '1.3' },
          labelBgBorderRadius: 4,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
        };
        setEdges((nds: Edge[]) => nds.concat(addNewEdge));
      }

      setNodes((nds: Node[]) => nds.concat(newNode));
    },
    [reactFlowInstance, setEdges, setNodes]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

  }, []);

  const onDiagramSave = () => {
    if (diagramName !== '') {
      setDiagrams(
        Object.assign(diagrams, {
          [diagramName]: { nodes: getNodes(), edges: getEdges() },
        })
      );
    } else {
      alert('Please enter a diagram name');
    }
  };

  return {
    nodes,
    nodeTypes,
    reactFlowWrapper,
    edges,
    edgeStyleType,
    diagramName,
    setNodes,
    onNodesChange,
    setEdges,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    initialEdges,
    initialNodes,
    size,
    ref,
    setReactFlowInstance,
    setEdgeStyleType,
    setDiagramName,
    onDiagramSave,
  };
};
