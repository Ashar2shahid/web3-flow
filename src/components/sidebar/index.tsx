'use client';

import { sidebarNavigation } from '@/configs';

import { camelCase } from 'lodash';
import React, { DragEvent } from 'react';

import { Icons } from '../ui/Icons';
import { NodeType } from '@/types';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store/use-global-store';

interface NodeData {
  label: string;
}
const Sidebar = () => {
  // const onDragStart = (event: DragEvent<HTMLDivElement>, data: NodeData) => {
  //   event.dataTransfer.effectAllowed = "move";
  // };
  const { setDragOn } = useGlobalStore()
  const onDragStart = (
    e: DragEvent<HTMLDivElement>,
    data: NodeData,
    targetId?: string
  ) => {
    e.dataTransfer.setData(`application/reactflow/label`, data.label);
    e.dataTransfer.setData(`application/reactflow/type`, camelCase(data.label));
    setDragOn(true)
    if (targetId) e.dataTransfer.setData('targetId', targetId);
  };

  return (
    <aside className='w-80 h-[calc(100vh-100px)] overflow-hidden bg-white dark:bg-background'>
      <div className='flex flex-col gap-4 items-start justify-start px-6  mt-10'>
        {sidebarNavigation.map((item, index) => (
          <div key={index} className='w-full'>
            <h3 className='text-lg text-gray-950 font-bold'>{item.label}</h3>
            <div className='flex flex-col gap-2 w-full'>
              {item.children.map((item, index) => {
                const Icon = Icons[item.icon ?? 'chevronLeft'];
                return (
                  <div
                    key={index}
                    className='mt-1 px-5 py-3 border flex items-center justify-between gap-4 w-full hover:shadow-md transition-all duration-300 cursor-grab'
                    draggable
                    onDragStart={event =>
                      onDragStart(
                        event,
                        {
                          label: item.name,
                        },
                        item.targetId
                      )
                    }
                    onDragEnd={() =>
                      setDragOn(false)
                    }
                  >
                    <div className=' flex items-center gap-4 w-full'>
                      <div
                        className={cn(
                          'px-1.5 py-1 rounded-md bg-slate-100',

                          item.id === NodeType.EMAIL && 'bg-emerald-100',
                          item.id === NodeType.SMS && 'bg-emerald-100',

                          item.id === NodeType.EMAIL && 'bg-emerald-100',
                          item.id === NodeType.SMS && 'bg-emerald-100',

                          item.id === NodeType.UPDATE_PROFILE && 'bg-orange-100'
                        )}
                      >
                        <Icon size={14} className='text-gray-500' />
                      </div>
                      <h6 className='text-gray-500 text-xs'>{item.name}</h6>
                    </div>
                    <div>
                      <Icons.grip size={20} className='text-gray-400' />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
