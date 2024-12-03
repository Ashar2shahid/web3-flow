'use client';

import { Button } from '@/components/ui/button';
import useLayoutNodes from '@/hooks/elkjs';
import { cn, toJSON } from '@/lib/utils';
import { usePropertyStore } from '@/store/usePropertyStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Panel,
  Viewport,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './components/sidebar';

import { BridgeEdge, CustomEdge } from '@/components/elkjs-flow';
import { Properties } from './components/sidebar/properties';
import { useElkFlow } from '@/components/elkjs-flow/hooks/useElkFlow';
import Link from 'next/link';
import { Modal } from '@mantine/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAnimatedNodes } from '@/hooks/useAnimateNode';

const proOptions = { hideAttribution: true };
const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};
const ElkjsFlowPage = () => {
  const [layout, setLayout] = useState(false);
  const { showProperty, setShowProperty, setProperties } = usePropertyStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    nodes,
    nodeTypes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    reactFlowWrapper,
    setReactFlowInstance,
    onDrop,
    onDragOver,
    size,
    ref,
  } = useElkFlow();

  const { setTheme, theme, systemTheme } = useTheme();
  const { themeStyle, setThemeStyle } = useThemeStore();
  useEffect(() => {
    if (theme === 'light') {
      setIsDarkMode(false);
    } else if (theme === 'system') {
      if (systemTheme === 'dark') {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    } else {
      setIsDarkMode(true);
    }
  }, [theme, systemTheme]);

  const edgeTypes: any = useMemo(
    () => ({
      bridge: BridgeEdge,
      custom: CustomEdge,
    }),
    []
  );
  useLayoutNodes();

  const handleCloseSidebar = () => {
    setShowProperty(false);
    setProperties(null);
  };

  useEffect(() => {
    if (themeStyle === 'turbo-flow') {
      document.documentElement.style.setProperty(
        '--edge-path-stroke',
        'url(#edge-gradient)'
      );
    } else {
      document.documentElement.style.setProperty('--edge-path-stroke', 'black');
    }
  }, [themeStyle, theme]);

  const defaultViewport: Viewport = {
    x: size.width / 2 || 650,
    y: 80,
    zoom: 1,
  };
  const handleOpenModal = () => {
    setLayout(true);
  };
  const {nodes:animateNodes}=useAnimatedNodes(nodes)
  return (
    <React.Fragment>
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 bg-[#eaedef]'>
          <div className='px-5 flex '>
            <Modal
              title='Contact us'
              centered
              opened={layout}
              onClose={() => setLayout(false)}
            >
              <h1>Email: azimaahmed36@gmail.com</h1>
            </Modal>
            <div className='flex-1 w-full'>
              <div className='w-full flex pb-5 gap-5 h-screen'>
                <div
                  className={cn(
                    "h-[calc(100vh)] transition-['width'] duration-300 ",

                    showProperty ? 'w-[70%]' : 'w-full'
                  )}
                  ref={reactFlowWrapper}
                >
                  <ReactFlow
                    {...{
                      proOptions,
                      nodeTypes,
                 
                      onNodesChange,
                      edgeTypes,
                      onEdgesChange,
                      onConnect,
                      onDragOver,
                      edges,
                      defaultViewport,
                      ref,
                    }}
                    nodes={animateNodes}
                    nodesConnectable={true}
                    onPaneClick={handleCloseSidebar}
                    maxZoom={2}
                    minZoom={0.3}
                    // deleteKeyCode={`Delete`}
                    onInit={setReactFlowInstance}
                    // fitView
                    selectionOnDrag
                    nodeOrigin={[0.5, 0.5]}
                    defaultEdgeOptions={defaultEdgeOptions}
                    fitViewOptions={{ maxZoom: 0.8 }}
                    className='border rounded-md'
                    id='canvas'
                  >
                    <Background />
                    <Controls />
                    <Panel
                      style={{ display: 'flex', gap: '4px' }}
                      position={'top-left'}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button>Download</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => toJSON([...nodes, ...edges])}
                          >
                            JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem>PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button>
                        <Link href={'/'}>d3-hierarchy</Link>
                      </Button>
                      <Button onClick={handleOpenModal}>Contact</Button>
                    </Panel>
                    {/* <MiniMap zoomable pannable /> */}
                    <style jsx>{`
                      .react-flow__edge-path {
                        stroke: url(#edge-gradient) !important;
                        stroke-width: 2;
                        stroke-opacity: 0.75;
                      }
                    `}</style>
                  </ReactFlow>
                </div>
                <Properties />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ElkjsFlowPage;
