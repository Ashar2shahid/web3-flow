

import { ISidebarNavigation } from "@/types";
import { camelCase, flatMap, pick } from "lodash";
import { NodeTypes } from "reactflow";
import { Condition, Delay, Email, Notification, Profile, SMS, Webhook } from "../node";

export enum DrawerAction {
   EMAIL = "email",
   SMS = "sms",
   // PUSH = "push",
   WEBHOOK = "webhook",
   UPDATE_PROFILE = "updateProfileProperty",
   NOTIFICATION = "notification",
   CONDITION = "condition",
   TIME_DELAY = "timeDelay",
   // START="start",
   EXIT = "exit",
   // FLOAT="float"

  
 }


export const sidebarNavigation:ISidebarNavigation[] = [
   

    {
     label:"Actions",
     type:"action",
     children:[
        {
        name:"Email",
        id:DrawerAction.EMAIL,
        icon: "mail",
        component:Email

     },
     {
        name:"SMS",
        id:DrawerAction.SMS,
        icon: "message",
        component:SMS
     },
     {
        name:"Update Profile Property",
        icon: "user",
        id:DrawerAction.UPDATE_PROFILE,
        component:Profile
        
     },
     {
        name:"Notification",
        icon:"bell",
        id:DrawerAction.NOTIFICATION,
        component:Notification
     },
     {
      name: "Webhook",
      id:DrawerAction.WEBHOOK,
      icon: "webhook",
      component:Webhook
     }
    ]
    },
    {
      label:"Timing",
      type:"delay",
      children:[
         {
         name:"Time Delay",
         icon:"clock",
         id:DrawerAction.TIME_DELAY,
         component:Delay
         }
      ]
    },
    {
      label:"Logic",
      type:"condition",
      children:[
         {
         name:"Conditional split",
         icon:"condition",
         id:DrawerAction.CONDITION,
         component:Condition

         }
      ]
    }
]

export const generatedNodeTypes: NodeTypes = Object.assign(
   {},
   ...flatMap(sidebarNavigation, (item) =>
     flatMap(item.children, (child) => {
     
       return pick(child, ["name","icon","id", "component"]);
     })
   ).map((node) => ({
     [camelCase(node.name)!]: node.component,
   }))
 );