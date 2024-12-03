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

// Helper component to render the edge label with different
function EdgeLabel({ transform, label }: { transform: string; label: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        transform,
      }}
      className={`nodrag nopan absolute items-center flex justify-center font-bold rounded-[10px] px-2 py-1 ${
        label === 'Yes'
          ? 'text-green-500 bg-[#96D9AA]'
          : 'text-[#C73131] bg-[#F1CCCC]'
      }`}
    >
      {label}
    </div>
  );
}

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const addNodeType = useEdgeClick(id);
  const [isDropzoneActive, setDropzoneActive] = useState(false);
  const { isDragOn,setDragOn } = useGlobalStore();
  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    // setDragOn(false)
  };

  const onDragEnter = () => {
    setDropzoneActive(true);
    // setDragOn(false)
  };

  const onDragLeave = () => {
    setDropzoneActive(false);
    // setDragOn(false)
  };
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {data?.label && (
          <EdgeLabel
            transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
            label={data?.label}
          />
        )}
        {data?.icon && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${targetX}px,${
                targetY - 80
              }px)`,
              fontSize: 12,
              zIndex: 10,
              pointerEvents: 'all',
            }}
            onDrop={event => {
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
                <PlusIcon
                  className={cn(
                    'h-8 w-8 flex-shrink-0 text-[#6039DB]',
                    isDragOn && 'hidden'
                  )}
                />
              </DialogTrigger>
              <DialogContent>
                <div className='flex flex-col gap-4 items-start justify-start px-6 mt-10'>
                  {sidebarNavigation.map((item, index) => (
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
                        {item.children.map((childItem, childIndex) => {
                          const Icon = Icons[childItem.icon ?? 'chevronLeft'];
                          return (
                            <div
                              key={childIndex}
                              className='mt-1 px-5 py-3 border flex items-center justify-between gap-4 w-full hover:shadow-md transition-all duration-300 cursor-grab'
                              onClick={() => {
                                addNodeType(
                                  childItem.name,
                                  camelCase(childItem.name) as NodeType
                                );
                              }}
                            >
                              <div className='flex items-center gap-4 w-full'>
                                <div
                                  className={cn(
                                    'px-1.5 py-1 rounded-md bg-slate-100',
                                    childItem.id === NodeType.EMAIL &&
                                      'bg-emerald-100',
                                    childItem.id === NodeType.SMS &&
                                      'bg-emerald-100',
                                    childItem.id === NodeType.UPDATE_PROFILE &&
                                      'bg-orange-100'
                                  )}
                                >
                                  <Icon size={14} className='text-gray-500' />
                                </div>
                                <h6 className='text-gray-500 text-xs'>
                                  {childItem.name}
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
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
