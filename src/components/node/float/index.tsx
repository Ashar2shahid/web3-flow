'use client';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/Icons';
import { sidebarNavigation } from '@/configs';
import usePlaceholderClick from '@/hooks/usePlaceholderClick';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store/use-global-store';
import { NodeType } from '@/types';
import { PlusIcon } from 'lucide-react';
import { DragEvent, useState } from 'react';
import { Handle, Position } from 'reactflow';

const FloatNode = ({ data, id }: any) => {
  const [isDropzoneActive, setDropzoneActive] = useState<boolean>(false);
  const { onFloatNodeClick } = usePlaceholderClick();
  const addNodeType = (name: string) => {
    onFloatNodeClick(id, { name });
  };

  const { isDragOn, setDragOn } = useGlobalStore()

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
        ' rounded-md grid place-content-center shadow-lg bg-white border border-dashed border-indigo-200',
        isDragOn ? 'bg-gray-100 w-72 h-16 border-4' : 'w-14 h-14'
      )}
      onDrop={event => {
        // const type = event.dataTransfer.getData('application/reactflow/type');

        const label = event.dataTransfer.getData('application/reactflow/label');
        addNodeType(label);
        setDropzoneActive(false);
        setDragOn(false)
      }}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <Dialog>
        <DialogTrigger className={cn(isDragOn ? 'hidden' : 'block')}>
          <PlusIcon className={`${'h-10 w-10'} flex-shrink-0 text-[#6039DB]`} />
        </DialogTrigger>
        <DialogContent>
          <div className='flex flex-col gap-4 items-start justify-start px-6  mt-10'>
            {sidebarNavigation.map((item, index) => (
              <div key={index} className='w-full'>
                <h3 className='text-lg text-gray-950 font-bold'>
                  {item.label}
                </h3>
                <div className='flex flex-col gap-2 w-full'>
                  {item.children.map((item, index) => {
                    const Icon = Icons[item.icon ?? 'chevronLeft'];
                    return (
                      <div
                        key={index}
                        className='mt-1 px-5 py-3 border flex items-center justify-between gap-4 w-full hover:shadow-md transition-all duration-300 cursor-grab'
                        onClick={() => onFloatNodeClick(id, item)}
                      >
                        <div className=' flex items-center gap-4 w-full'>
                          <div
                            className={cn(
                              'px-1.5 py-1 rounded-md bg-slate-100',

                              item.id === NodeType.EMAIL && 'bg-emerald-100',
                              item.id === NodeType.SMS && 'bg-emerald-100',

                              item.id === NodeType.EMAIL && 'bg-emerald-100',
                              item.id === NodeType.SMS && 'bg-emerald-100',

                              item.id === NodeType.UPDATE_PROFILE &&
                                'bg-orange-100'
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
        </DialogContent>
      </Dialog>

      <div className='   '>
        <Handle
          type='target'
          position={Position.Top}
          style={{ visibility: 'hidden' }}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          style={{ visibility: 'hidden' }}
        />
      </div>
    </div>
  );
};
export default FloatNode;
