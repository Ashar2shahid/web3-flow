import { NodeLayout } from "@/components/elkjs-flow";
import React from "react";

import { Node } from "reactflow";


export const Profile = (props: Node) => {
  return (
    <NodeLayout
      title="Update profile property"
      icon="user"
      type="action"
      nodeProps={props}
 
    />
  );
};
