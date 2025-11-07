import { UIMessage } from "ai";

// Define the JSON-RPC request structure
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params: any;
  id: number;
}

// Function to send a JSON-RPC request to an agent
async function sendJsonRpcRequest(
  agentEndpoint: string,
  method: string,
  params: any,
  id: number
): Promise<any> {
  const request: JsonRpcRequest = {
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: id,
  };

  try {
    const response = await fetch(agentEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending JSON-RPC request:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const url = new URL(req.url);
  const agentEndpoint = url.searchParams.get("agentEndpoint");

  if (!agentEndpoint) {
    return new Response("Agent endpoint not provided in query parameters", { status: 400 });
  }

  // Construct the JSON-RPC request
  const method = "processMessage"; // Define the method to call on the agent
  const params = { messages: messages };
  const id = 1; // Request ID

  try {
    // Send the JSON-RPC request
    const result = await sendJsonRpcRequest(agentEndpoint, method, params, id);

    // Return the result as a stream
    const responseText = JSON.stringify(result);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(responseText));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
