import { PlusIcon } from 'lucide-react';
import React, { DragEvent, useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { sidebarNavigation } from '@/configs';
import { cn } from '@/lib/utils';
import { NodeType } from '@/types';
import { camelCase } from 'lodash';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/Icons';
import { useEdgeClick } from '../hooks/useEdgeClick';
import { useGlobalStore } from '@/store/use-global-store';

export const BridgeEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: any) => {
  const addNodeType = useEdgeClick(id);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { isDragOn, setDragOn } = useGlobalStore()
  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

 

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetX}px,${
              targetY - 50
            }px)`,
            fontSize: 12,
            zIndex: 10,
            pointerEvents: 'all',
          }}
       
          
        >
          <div
            onDrop={event => {
              event.preventDefault();
              event.stopPropagation();
          
              const type = event.dataTransfer.getData(
                'application/reactflow/type'
              );
              const label = event.dataTransfer.getData(
                'application/reactflow/label'
              );
              setDragOn(false)
              addNodeType(label, type as any);

            }}
            onDragOver={onDragOver}
            className={cn(
              '  ',
              isDragOn
                ? 'bg-gray-100 w-72 h-16 rounded-lg border-4 border-dashed nodrag nopan'
                : ' '
            )}
          >
            <Dialog>
              <DialogTrigger
                className={cn(
                  'border border-indigo-200 grid h-10 w-10 rounded-full place-content-center shadow-lg bg-white  border-dashed',
                  isDragOn ? 'hidden' : '  grid'
                )}
              >
                <PlusIcon
                  className={cn('h-8 w-8 flex-shrink-0 text-[#6039DB]')}
                />
              </DialogTrigger>
              <DialogContent>
                <div className='flex flex-col gap-4 items-start justify-start px-6 mt-10'>
                  {sidebarNavigation.map((item, index) => {
                    return (
                      <div key={index} className='w-full'>
                        <h3
                          className={cn(
                            'text-lg text-gray-950 font-bold',
                            item.type === 'condition' ? 'hidden' : ''
                          )}
                        >
                          {item.label}
                        </h3>
                        <div className='flex flex-col gap-2 w-full'>
                          {item.children.map((item, index) => {
                            const Icon = Icons[item.icon ?? 'chevronLeft'];
                            return (
                              <div
                                key={index}
                                className='mt-1 px-5 py-3 border flex items-center justify-between gap-4 w-full hover:shadow-md transition-all duration-300 cursor-grab'
                                onClick={() => {
                                  addNodeType(
                                    item.name,
                                    camelCase(item.name) as NodeType
                                  );
                                }}
                              >
                                <div className='flex items-center gap-4 w-full'>
                                  <div
                                    className={cn(
                                      'px-1.5 py-1 rounded-md bg-slate-100',

                                      item.id === NodeType.EMAIL &&
                                        'bg-emerald-100',
                                      item.id === NodeType.SMS &&
                                        'bg-emerald-100',

                                      item.id === NodeType.UPDATE_PROFILE &&
                                        'bg-orange-100'
                                    )}
                                  >
                                    <Icon size={14} className='text-gray-500' />
                                  </div>
                                  <h6 className='text-gray-500 text-xs'>
                                    {item.name}
                                  </h6>
                                </div>
                                <div>
                                  <Icons.grip
                                    size={20}
                                    className='text-gray-400'
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
