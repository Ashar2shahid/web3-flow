import { NodeType } from "@/types";
import { Node } from "reactflow";

export enum BranchType {
  EVENT = "event",
  MAX_TIME = "maxTime",
  ATTRIBUTE = "attribute",
  WU_ATTRIBUTE = "wu_attribute",
  MESSAGE = "message",
  MULTISPLIT = "multisplit",
  EXPERIMENT = "experiment",
}

export enum LogicRelation {
  AND = "and",
  OR = "or",
}

export enum StatementType {
  PROPERTY = "property",
  ELEMENT = "element",
}

export enum ElementKey {
  TAG_NAME = "tagName",
  TEXT = "text",
}

interface Rules {
  id:string;
  combinator?:string;
  field:string;
  oparator:string;
  rules?:Rules[]
  value:string;
  not?:boolean
  valueSource:string;

}
export interface CommonCondition {
  // relationToNext: LogicRelation;
  combinator?:string;
  id:string;
  not?:boolean;
  rules:Rules[]

}

export enum WUAttributeHappenCondition {
  CHANGED = "changed",
  CHANGED_TO = "changed to",
}

export interface CommonBranch {
  id: string;
}

export enum TimeType {
  TIME_DELAY = "timeDelay",
  TIME_WINDOW = "timeWindow",
}

export interface CommonMaxTimeBranch extends CommonBranch {
  type: BranchType.MAX_TIME;
}

export interface DelayData {
  days: number;
  hours: number;
  minutes: number;
}

export interface TimeDelayBranch extends CommonMaxTimeBranch {
  timeType: TimeType.TIME_DELAY;
  // delay: DelayData;
  days: number;
}

export interface Stats {
  sent?: number;
  delivered?: number;
  clickedPercentage?: number;
  wssent?: number;
  openedPercentage?: number;
  failed?: number;
}

export interface CommonNodeData {
  stepId?: string;
  disabled?: boolean;
  label: string;
  background: string;
}
export interface MessageNodeData extends CommonNodeData {
  type: NodeType.SMS;
  name: string;

}

export interface EmailNodeData extends CommonNodeData {
  type: NodeType.EMAIL;
  subject?: string;
  sender_email?: string;
  
}

export interface NotificaionNodeData extends CommonNodeData {
  type: NodeType.NOTIFICATION;
  to_name?: string;

}

export interface TimeDelayNodeData extends CommonNodeData {
  type: NodeType.TIME_DELAY;
  delay?: number;
  unit?: string;
}

export interface ProfileProperty {
  actionId?:string
  label: string
  type?: string;
  value?: any;
}

export interface WebhookData {
  name: string;
}
export interface UserProfileNodeData extends CommonNodeData {
  type: NodeType.UPDATE_PROFILE;
  properties?: ProfileProperty[];
}

export enum TrackerVisibility {
  SHOW = "show",
  HIDE = "hide",
}

export interface IOr {
  contidion_type: string;
  person_has?:{
  metric: string;
  con: string;
  duration: string;
  duration_time:number;
  duration_type:string;
  },
  dimention?:{
    name: string;
    con: string;
    value: string;
    type?: string;
  
  },
  location?:{
   con: string;
   within: string;
  }
}
export interface IAnd{
  contidion_type: string;
  person_has?:{
  metric: string;
  con: string;
  duration: string;
  duration_time:number;
  duration_type:string;
  },
  dimention?:{
    name: string;
    con: string;
    value: string;
    type?: string;
  
  },
  location?:{
   con: string;
   within: string;
  }
}
export interface ConditonNodeData extends CommonNodeData {
  type: NodeType.CONDITION;
  or?:IOr[];
  and?:IAnd[]

}

export interface AnotherNodeData extends CommonNodeData {
  type?: Exclude<
    NodeType,
    | NodeType.SMS
    | NodeType.TIME_DELAY
    | NodeType.CONDITION
    | NodeType.EMAIL
    | NodeType.UPDATE_PROFILE
  >;
}

export type NodeDataType = {
  label?: string;
  background?: string;
  stepId?: string;
  type?: string;
  hieght?:string;
  isCollapsed?:boolean
  sms_data?: MessageNodeData;
  email_data?: EmailNodeData;
  delay_data?: TimeDelayNodeData;
  condition_data?: CommonCondition;
  profile_data?: UserProfileNodeData;
  notification_data?: NotificaionNodeData;
  webhook_data?: WebhookData;
  description?: string;
};

export interface NodeProperties extends Node {
  data: NodeDataType 
}

export const propertyData =[
  {
    id: "1",
    label:"Created",
    value: "created"
  },
  {
    id: "2",
    label:"Email",
    value: "email"

  },
  {
    id: "3",
    label:"Title",
    value: "title"

  },
  {
    id:"4",
    label:"First Name",
    value: "firstName"

  },
  {
   id:"5",
   label:"Last Name",
   value: "lastName"
  },
  {
    id:"6",
    label:"Phone Number",
    value: "phoneNumber"
  }
]
export enum OnboardingAction {
  NOTHING = "nothing",
  EMAIL = "email",
}