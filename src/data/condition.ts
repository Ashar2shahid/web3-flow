export const conditionData = [
  {
    id:"1",
    label:"What someone has done (or not done)"
  },
  {
    id:"2",
    label:"Properties about someone"
  },
  {
   id:"3",
   label:"If someone is or is not within the EU (GDPR)"
  },
  {
    id:"4",
    label:"If someone is in or not in a list",
  },
  {
    id:"5",
    label:"Predictive analytics about someone"
  }
]

export const metricData = [
{
  id:"1",
  label:"Bounce email",
  value: "bounceEmail"
},
{
  id:"2",
  label:"Click email",
  value: "clickEmail"
},
{
  id:"3",
  label:"Email open",
  value: "emailOpen"
},
{
  id:"4",
  label:"Email sent",
  value: "emailSent"
},
{
  id:"5",
  label:"Email unsubscribed",
  value: "emailUnsubscribed"
},
{
  id:"6",
  label:"Page view",
  value: "pageView"
},
{
  id:"7",
  label:"Purchase",
  value: "purchase"
},
{
  id:"8",
  label:"SMS sent",
  value: "smsSent"
},
{
  id:"9",
  label:"Webhook sent",
  value: "webhookSent"
}
]

export const operatorData = [
{
  id:"1",
  label:"Equals",
  value: "$eq"
},
{
  id:"2",
  label:"Does Not Equal",
  value: "$ne"
},
{
  id:"3",
  label:"< Less Than",
  value: "$lt"
},
{
  id:"4",
  label:"<= Less Than or Equal To",
  value: "$lte"
},
{
  id:"5",
  label:">= Greater Than or Equal To",
  value: "$gte"
},
{
  id:"6",
  label:"> Greater Than",
  value: "$gt"
},
{
  id:"7",
  label:"Is Before",
  value: "$lt"
},
{
  id:"8",
  label:"Is Before or On",
  value: "$lte"
},
{
  id:"9",
  label:"Is After or On",
  value: "$gte"
},
{
  id:"10",
  label:"Is After",
  value: "$gt"
},
{
  id:"11",
  label:"Is",
  value: "$eq"
},
{
  id:"12",
  label:"Equals Any Of",
  value: "$in"
},
{
  id:"13",
  label:"Does Not Equal Any Of",
  value: "$nin"
}
]

export const values = [
  { name: "option1", label: "Option 1" },
  { name: "option2", label: "Option 2" },
  { name: "option3", label: "Option 3" },
  { name: "option4", label: "Option 4" },
];

export const conditionfields = [
  { name: "has responded", label: "Has responded", inputType: "text" },
  // { name: "select", label: "select", valueEditorType: "select", values },
  { name: "has not respondedt", label: "Has not responded", input:"text" },
  { name: "very interested", label: " Very interested", input:"text" },
  { name: "Has a certain tag", label: " Has a certain tag", input:"text" },
  { name: "part of a list", label: " Part of a list", input:"text" },
  // { name: "radio", label: "radio", valueEditorType: "radio", values },
  // { name: "textarea", label: "textarea", valueEditorType: "textarea" },
  // {
  //   name: "multiselect",
  //   label: "multiselect",
  //   valueEditorType: "multiselect",
  //   values,
  // },
  // { name: "date", label: "date", inputType: "date" },
  // {
  //   name: "datetime-local",
  //   label: "datetime-local",
  //   inputType: "datetime-local",
  // },
  // { name: "time", label: "time", inputType: "time" },
  { name: "field", label: "field", valueSources: ["field", "value"] },
];
export const operators = [
  { name: "=", label: "=" },
  { name: "in", label: "in" },
  { name: "between", label: "between" },
];
export const defaultQuery = {
  combinator: "and",
  rules: [
   
  ]
  
};
export const NullComponent = () => null;

