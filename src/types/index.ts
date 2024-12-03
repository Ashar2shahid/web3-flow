import {type Icons } from "@/components/ui/Icons";


export interface NavItem {
    title?: string;
    href?: string;
    id?:string
    component?:any,
    targetId?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: keyof typeof Icons;
    name: string;
 
  }
  
  export interface TypesIcon {
    value: keyof typeof Icons;
    label: string;
  }
  
 
  
  export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[];
  }
 
  
  export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[];
  }

  export interface ISidebarNavigation {
    label: string;
    type: string;
    children: NavItem[];
  }

  export interface NodeData {
    label: string;
    mode:string;
    disabled?: boolean;
    background: string;
  
 
  }


export enum NodeType {
  START="start",
  EMAIL = "email",
  EMPTY="empty",
  SMS = "sms",
  // PUSH = "push",
  INSERT_NODE="insertNode",
  WEBHOOK = "webhook",
  UPDATE_PROFILE = "updateProfileProperty",
  NOTIFICATION = "notification",
  CONDITION = "conditionalSplit",
  TIME_DELAY = "timeDelay",
  EXIT = "EXIT",
  FLOAT="float",

}

export enum ENodeType {
  START="start",
  EMAIL = "email",
  EMPTY="empty",
  SMS = "sms",
  // PUSH = "push",
  INSERT_NODE="insertNode",
  WEBHOOK = "webhook",
  UPDATE_PROFILE = "updateProfileProperty",
  NOTIFICATION = "notification",
  CONDITION = "conditionalSplit",
  TIME_DELAY = "timeDelay",
  EXIT = "EXIT",

}
  

export const EdgeTypes = {
  bridge: "bridge", //only icon
  custom: "custom", //with label and icon
  default:"default"
}
  export enum EdgeType {
    DEFAULT = "default",
    CUSTOM = "custom",
    BRIDGE= "bridge", //only icon
 
  }
  