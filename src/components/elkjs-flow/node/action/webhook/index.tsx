import { NodeLayout } from "@/components/elkjs-flow";
import React from "react";

import { Node } from "reactflow";


export const Webhook = (props: Node) => {
  return (
    <NodeLayout
    icon="webhook"
     type="action"
      title="Webhook"
      nodeProps={props}
 
    />
  );
};
