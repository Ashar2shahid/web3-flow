import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import _ from "lodash";
import { nanoid } from "nanoid";
import { NodeType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const copyToClipboard = async ({
  target,
  message,
  value,
}: {
  target?: string
  value?: string
  message?: string
}) => {
  try {
    let copyValue = ""
    if (!navigator.clipboard) {
      throw new Error("Browser doesn't have support for native clipboard.")
    }
    if (target) {
      const node = document.querySelector(target)
      if (!node || !node.textContent) {
        throw new Error("Element not found")
      }
      value = node.textContent
    }
    if (value) {
      copyValue = value
    }
    await navigator.clipboard.writeText(copyValue)
    console.log(message ?? "Copied!!!")
  } catch (error) {
    console.log(error)
  }
}

export function slugify(value: string, delimiter: string = "_"): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, delimiter)
}
const addNewNode = (data: any) => {
  let newFlowId = nanoid();
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: { x: 100, y: 200 },
    data: {
      label: data.label,
      subLabel: "",
      stepType: data.stepType,
      days: 1,
      actionTitle: data.actionTitle,
      condition: null,
      branch: null,
    },
  };
  return newNode;
};

 const addNewFloatNode = () => {
  let newFlowId = nanoid();
  let newNode = {
    id: newFlowId,
    type: NodeType.FLOAT,
    position: { x: 0, y: 0 },
    data: {},
};
  return newNode;
};

const addNewEdge = (sourceId: string, targetId: string, type: string) => {
  let newEdgeId = nanoid();
  let newEdge = {
    id: newEdgeId,
    source: sourceId,
    target: targetId,
    type: type,
    data: {},
  };
  return newEdge;
};

function toJSON(elements: any) {
  const downloadLink = document.createElement("a");
  const fileBlob = new Blob([JSON.stringify(elements, null, 2)], {
    type: "application/json",
  });
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = `EXALGO_${nanoid(5)}.json`;
  downloadLink.click();
}

const checkduplicity = (arrayData: any) => {
  const itemsData = arrayData.filter((value: any, index: number) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arrayData.findIndex((obj: any) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  return itemsData;
};


function removeDuplicatesById(array1: any, array2: any) {
  // Concatenate the two arrays into a single array
  const combinedArray = [...array1, ...array2];

  // Remove duplicates based on the 'id' property
  const uniqueArray = _.uniqBy(combinedArray, "id");

  return uniqueArray;
}
function removeSimilarById(array1: any, array2: any) {
  // Remove items from array1 that have the same 'id' as items in array2
  const uniqueArray1 = _.differenceBy(array1, array2, "id");
  return uniqueArray1;
}
export {
  addNewNode,
  addNewEdge,
  addNewFloatNode,
  toJSON,
  checkduplicity,
  removeDuplicatesById,
  removeSimilarById,
};

export const nodeTypesNotConnectableByJumpTo: (string | undefined)[] = [
  NodeType.EMPTY,
  NodeType.INSERT_NODE,
  NodeType.START,
];
