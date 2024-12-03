'use client';
import React, { DragEvent, FC, useState } from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
} from 'reactflow';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { PlusIcon } from 'lucide-react';
import { sidebarNavigation } from '@/configs';
import { cn } from '@/lib/utils';
import { Icons } from '../ui/Icons';
import useEdgeClick from '@/hooks/useEdgeClick';
import { camelCase } from 'lodash';
import { NodeType } from '@/types';
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
  const [isDropzoneActive, setDropzoneActive] = useState(false);

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();


  };

  const onDragEnter = () => {
    setDropzoneActive(true);
    // setDragOn(true)
  };

  const onDragLeave = () => {
    setDropzoneActive(false);
    // setDragOn(false)

  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetX}px,${targetY - 55
              }px)`,
            fontSize: 12,
            zIndex: 10,
            pointerEvents: 'all',
          }}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          className='nodrag nopan'
        >
          <Dialog>
            <DialogTrigger

              className={cn(
                'border border-indigo-200 grid place-content-center shadow-lg bg-white  border-dashed',
                isDragOn
                  ? 'bg-gray-100 w-72 h-20 rounded-lg border-4'
                  : ' h-10 w-10 rounded-full'
              )}
            >
              {
                isDragOn ? <div onDrop={event => {
                  event.preventDefault();
                  event.stopPropagation();

                  const type = event.dataTransfer.getData(
                    'application/reactflow/type'
                  );
                  const label = event.dataTransfer.getData(
                    'application/reactflow/label'
                  );
                  addNodeType(label, type as any);
                  setDropzoneActive(false);
                  setDragOn(false)
                }} className={cn(
                  'border-4 border-indigo-200 grid place-content-center shadow-lg bg-white  border-dashed',
                  'bg-gray-100 w-72 h-20 rounded-lg'
                )}>

                </div> :
                  <PlusIcon
                    className={cn(
                      'h-8 w-8 flex-shrink-0 text-[#6039DB]',
                      isDragOn && 'hidden'
                    )}
                  />
              }

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
      </EdgeLabelRenderer>
    </>
  );
};
