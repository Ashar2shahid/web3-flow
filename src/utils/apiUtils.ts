import { Node, Edge } from "reactflow";

interface WorkflowPayload {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowResponse {
  message: string;
  workflowId: string;
}

interface WorkflowStatus {
  id: string;
  nodes: {
    id: string;
    status: "completed" | "running" | null;
  }[];
  status: "running" | "completed" | "failed";
}

export async function executeWorkflow(
  payload: WorkflowPayload
): Promise<string> {
  const response = await fetch("http://localhost:3000/api/workflows/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to execute workflow");
  }

  const data: WorkflowResponse = await response.json();
  return data.workflowId;
}

export async function getWorkflowStatus(
  workflowId: string
): Promise<WorkflowStatus> {
  const response = await fetch(
    `http://localhost:3000/api/workflows/${workflowId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch workflow status");
  }

  return response.json();
}
