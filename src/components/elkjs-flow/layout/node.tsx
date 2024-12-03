'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Handle,
  Position,
  getConnectedEdges,
  getOutgoers,
  useReactFlow,
} from 'reactflow';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import _ from 'lodash';

import { NodeProperties, propertyData } from '@/data/NodeData';
import { usePropertyStore } from '@/store/usePropertyStore';
import { EdgeType, NodeType } from '@/types';
import { ChevronDownIcon, Copy, Delete } from 'lucide-react';
import { DragEvent, ReactNode, useCallback, useState } from 'react';

import { nanoid } from 'nanoid';
import { useNodeDataChange } from '@/hooks/useUpdateNode';
import useLayoutNodes from '@/hooks/elkjs';
import { Icons } from '@/components/ui/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/store/use-global-store';

export interface NodeLayoutProps {
  title: string;
  nodeProps?: NodeProperties;
  type: string;
  icon: keyof typeof Icons;
}

export const tileColorMap: Record<string, string> = {
  notification: 'bg-amber-100',
  sms: 'bg-emerald-100',
  push: 'bg-cyan-100',
  webhook: 'bg-emerald-100',
  updateProfileProperty: 'bg-rose-100',
  email: 'bg-emerald-100',
  timeDelay: 'bg-lime-100',
  conditionalSplit: 'bg-indigo-100',
} as const;
type TileColorMap = typeof tileColorMap;

export function getTileColor(
  type?: string,
  defaultColor: string = 'bg-slate-100'
) {
  if (type) {
    // Check for exact matches first
    const typeKey = type as keyof TileColorMap;
    if (tileColorMap[typeKey]) {
      return tileColorMap[typeKey];
    }
    // Check for prefix matches
    for (const key in tileColorMap) {
      if (type.startsWith(key)) {
        return tileColorMap[key as keyof TileColorMap];
      }
    }
  }
  return defaultColor;
}

const checkduplicity = (arrayData: any) => {
  const itemsData = arrayData.filter((value: any, index: number) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arrayData.findIndex((obj: any) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  return itemsData;
};

function removeSimilarById(array1: any, array2: any) {
  // Remove items from array1 that have the same 'id' as items in array2
  const uniqueArray1 = _.differenceBy(array1, array2, 'id');
  return uniqueArray1;
}
export const NodeLayout = (props: NodeLayoutProps) => {
  const { nodeProps, type, icon, title } = props;

  const { themeStyle } = useThemeStore();
  const { setShowProperty, setProperties, showProperty } = usePropertyStore();
  const { getNodes, setEdges, getEdges, setNodes, getNode, addNodes } =
    useReactFlow();
  const IconComponet = Icons[icon];
  const avatarImageAlt = `${type}-${title}`;
  const profileData = nodeProps?.data?.profile_data?.properties?.find(item =>
    propertyData.some(prop => prop?.value === item.label)
  );
  const profileNode = nodeProps?.data?.profile_data?.properties?.[0] || null;
  const edges = getEdges();
  const nodes = getNodes();
  const [collapse, setCollaps] = useState(
    nodeProps?.data?.isCollapsed ?? false
  );

  const { setDragOn, isDragOn } = useGlobalStore();
  const { applyAutoLayout } = useLayoutNodes();
  const dropNode = () => {
    const node = nodeProps;
    if (!node) return;

    const connectedEdges = getConnectedEdges([node], edges);

    // Find the previous and next nodes
    const incomingEdges = edges.filter(e => e.target === node.id);
    const outgoingEdges = edges.filter(e => e.source === node.id);

    let previousNodeId: any = null;
    if (incomingEdges.length > 0) {
      previousNodeId = incomingEdges[0].source; // Assuming single incoming edge
    }

    console.log({ previousNodeId });

    let nextNodeId = null;
    if (outgoingEdges.length > 0) {
      nextNodeId = outgoingEdges[0].target; // Assuming single outgoing edge
    }

    const nextNode = getNode(nextNodeId as string);

    if (node.type !== NodeType.CONDITION) {
      // Remove the node
      setNodes(() => {
        const copyNodes = [...nodes];
        const filteredNodes = copyNodes.filter(item => item.id !== node.id);
        return filteredNodes;
      });

      // Remove the connected edges
      const eliminated = _.differenceBy(edges, connectedEdges, 'id');
      // if previous node is condiotion add Label and icon new adge data
      const prevNode = getNode(previousNodeId as string);
      // Get the label of the edge connecting the previous node to the current node
      const previousEdge = incomingEdges.find(e => e.source === previousNodeId);

      // Add a new edge connecting the previous and next nodes
      if (previousNodeId && nextNodeId) {
        if (prevNode?.type === NodeType.CONDITION) {
          eliminated.push({
            id: `${previousNodeId}-${nextNodeId}`,
            source: previousNodeId,
            type: EdgeType.BRIDGE,
            data: { label: previousEdge?.data?.label, icon: '+' },
            target: nextNodeId,
          });
        } else {
          eliminated.push({
            id: `${previousNodeId}-${nextNodeId}`,
            source: previousNodeId,
            type:
              nextNode?.type === NodeType.FLOAT
                ? EdgeType.CUSTOM
                : EdgeType.BRIDGE,
            target: nextNodeId,
          });
        }
      }

      setEdges(() => eliminated);
    } else {
      // Add a new edge connecting the previous node to a new float node if no next node is available
      if (previousNodeId) {
        const prevNode = getNode(previousNodeId as string);
        // Create a new float node and connect to the previous node
        const newFloatNodeId = nanoid();
        const newFloatNode = {
          id: newFloatNodeId,
          position: {
            x: prevNode?.position.x ?? 0,
            y: (prevNode?.position.y ?? 0) + 100,
          }, // Adjust position as needed
          type: NodeType.FLOAT,
          data: { label: '+', parentId: previousNodeId },
        };

        const nodesData = removeTreeOfOutgoers(node);
        const checkDuplic = checkduplicity(nodesData.flat());
        setNodes((nodes: any) => {
          const nodesCopy = [...nodes];
          const combinedArray: any = removeSimilarById(nodesCopy, checkDuplic);
          const newNodes = [...combinedArray, newFloatNode];
          return newNodes;
        });

        setEdges(edges => {
          const clonedEdges = [...edges];
          const incomingEdges = edges.filter(x => x.target === node.id);
          const outgoingEdges = edges.filter(x => x.source === node.id);
          const updatedIncomingEdges = incomingEdges.map(x => ({
            ...x,
            target: newFloatNode.id,
            data: { ...x.data },
            type: EdgeType.DEFAULT,
          }));
          const filteredEdges = clonedEdges.filter(
            x =>
              x.target !== incomingEdges[0].target &&
              x.source !== outgoingEdges[0].source
          );
          filteredEdges.push(...updatedIncomingEdges);
          return filteredEdges;
        });
        // now
      }
    }

    // Reset properties and hide property panel
    setTimeout(() => {
      setProperties(null);
      setShowProperty(false);
      applyAutoLayout();
    }, 20);
  };
  let storedData: any = [];
  function removeTreeOfOutgoers(newNode: any) {
    const outgoers = getOutgoers(newNode, nodes, edges);
    // const connectedEdgess = getConnectedEdges(new Array(newNode), edges);
    storedData.push([...outgoers, newNode]);
    if (outgoers.length) {
      outgoers.forEach(outgoer => removeTreeOfOutgoers(outgoer));
    }

    return storedData;
  }
  const { updateNodeData } = useNodeDataChange();
  const toggleCollaps = () => {
    const newCollapsState = !collapse;
    setCollaps(newCollapsState);

    // Update the node data with the new isCollapsed state
    updateNodeData({
      id: nodeProps?.id as string,
      data: {
        ...nodeProps?.data,
        isCollapsed: newCollapsState,
        height: collapse ? '280px' : 'auto',
      },
    });
    applyAutoLayout();
  };
  const nodeToSettingsComponentMap: Record<string, ReactNode> = {
    [NodeType.EMAIL]: (
      <>
        {nodeProps?.type === NodeType.EMAIL && (
          <div className='space-y-3'>
            {nodeProps.data.email_data?.sender_email ? (
              <h5>{nodeProps.data.email_data?.sender_email}</h5>
            ) : (
              <h5 className='bg-[#fff8c9] border-2 border-yellow-300 text-yellow-800 rounded-md px-3 py-3'>
                Set Up Email
              </h5>
            )}
          </div>
        )}
      </>
    ),

    [NodeType.SMS]: (
      <>
        {nodeProps?.type === NodeType.SMS && (
          <div className='space-y-3'>
            {nodeProps.data.sms_data ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: nodeProps.data.description as any,
                }}
              />
            ) : (
              <h5 className='bg-[#fff8c9] border-2 border-yellow-300 text-yellow-800 rounded-md px-3 py-3'>
                Set Up SMS
              </h5>
            )}
          </div>
        )}
      </>
    ),

    [NodeType.NOTIFICATION]: (
      <>
        {nodeProps?.type === NodeType.NOTIFICATION && (
          <div className='space-y-3'>
            {nodeProps.data.notification_data?.to_name ? (
              <h5>{nodeProps.data.notification_data.to_name}</h5>
            ) : (
              <h5 className='bg-[#fff8c9] border-2 border-yellow-300 text-yellow-800 rounded-md px-3 py-3'>
                Set Up Notification
              </h5>
            )}
          </div>
        )}
      </>
    ),

    [NodeType.UPDATE_PROFILE]: (
      <>
        {nodeProps?.type === NodeType.UPDATE_PROFILE && (
          <div className='space-y-3'>
            {nodeProps.data.profile_data?.properties ? (
              <div className='flex'>
                <h5 className='text-base font-semibold'>
                  Update {profileData ? profileData?.label : profileNode?.label}{' '}
                  to {profileData ? profileData?.value : profileNode?.value}
                </h5>
              </div>
            ) : (
              <h5 className='bg-[#fff8c9] border-2 border-yellow-300 text-yellow-800 rounded-md px-3 py-3'>
                Set Up Profile
              </h5>
            )}
          </div>
        )}
      </>
    ),

    [NodeType.TIME_DELAY]: (
      <>
        {nodeProps?.type === NodeType.TIME_DELAY && (
          <div className='space-y-3'>
            {!nodeProps.data.delay_data?.delay && (
              <h5 className='bg-[#fff8c9] border-2 border-yellow-300 text-yellow-800 rounded-md px-3 py-3'>
                Set up time delay
              </h5>
            )}
          </div>
        )}
      </>
    ),

    [NodeType.WEBHOOK]: (
      <>
        {nodeProps?.type === NodeType.WEBHOOK && (
          <div className='space-y-3'></div>
        )}
      </>
    ),

    [NodeType.CONDITION]: (
      <>
        {nodeProps?.type === NodeType.CONDITION && (
          <div className='space-y-3'>
            {nodeProps.data.condition_data ? (
              // <h3>dfds</h3>
              <h5>{nodeProps?.data?.condition_data?.rules[0].value ?? ''}</h5>
            ) : (
              <h5 className='bg-[#fff8c9] border-2 border-yellow-300 text-yellow-800 rounded-md px-3 py-3'>
                Set up conditional split
              </h5>
            )}
          </div>
        )}
      </>
    ),
  };

  const [isDropzoneActive, setDropzoneActive] = useState<boolean>(false);

  const onDrop = () => {
    setDropzoneActive(false);
  };

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  const onDragEnter = () => {
    setDropzoneActive(true);
  };

  const onDragLeave = () => {
    setDropzoneActive(false);
  };

  return (
    <div
      className={cn(
        nodeProps?.type === NodeType.TIME_DELAY ? 'w-[300px]' : 'w-[400px]',
        'min-h-[100px] relative'
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onClick={() => {
        setShowProperty(false);
        setProperties(null);

        setTimeout(() => {
          setShowProperty(true);
          setProperties(nodeProps);
        }, 10);
      }}
      style={{
        height: nodeProps?.data?.hieght ?? '100px',
      }}
    >
      <Handle
        type='target'
        isConnectable={true}
        id={nodeProps?.type + '_top'}
        position={Position.Top}
      />

      <Handle
        type='source'
        isConnectable={true}
        id={nodeProps?.type + '_bottom'}
        position={Position.Bottom}
      />

      <div
        className={cn('relative group ', {
          'gradient rounded-md  p-1': themeStyle === 'turbo-flow',
        })}
      >
        <Card
          className={cn(
            'w-full px-4 py-3 flex flex-col gap-3 h-full',
            nodeProps?.selected && 'shadow-xl'
          )}
        >
          <CardHeader className='grid p-4 px-5'>
            <div className='flex w-full items-center space-x-4'>
              <Avatar>
                <AvatarImage
                  className='bg-red-600'
                  src=''
                  alt={avatarImageAlt}
                />
                <AvatarFallback className={cn(getTileColor(nodeProps?.type))}>
                  <IconComponet className='w-6 h-6' />
                </AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-1 justify-between space-x-12'>
                <div className='flex flex-col'>
                  <CardTitle className='flex w-full items-center justify-between text-sm font-medium leading-none'>
                    <div className='flex w-full'>
                      {nodeProps?.type === NodeType.TIME_DELAY ? (
                        nodeProps.data.delay_data?.delay ? (
                          <h5 className='text-lg'>
                            wait {nodeProps.data.delay_data.delay}{' '}
                            {nodeProps.data.delay_data.unit}
                          </h5>
                        ) : (
                          <h5 className='text-lg'>{title}</h5>
                        )
                      ) : (
                        <h5 className='text-lg'>{title}</h5>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription className='mt-1 text-sm text-muted-foreground'>
                    {type}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={e => e.stopPropagation()}
                  >
                    <Button variant='outline' className='m-0 h-6 w-6 p-0'>
                      <ChevronDownIcon className='m-1 h-4 w-4 text-muted-foreground' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        toggleCollaps();
                      }}
                    >
                      <span className='text-xs'>Collapse</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        dropNode();
                      }}
                    >
                      <Delete className='mr-2 h-4 w-4 text-red-600' />
                      <span className='text-xs text-red-600'>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          {collapse && (
            <CardContent className='px-5 pb-4 pt-0'>
              {nodeToSettingsComponentMap[nodeProps?.type || '']}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
