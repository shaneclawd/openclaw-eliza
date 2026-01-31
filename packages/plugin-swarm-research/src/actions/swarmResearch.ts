import {
  Action,
  IAgentRuntime,
  Memory,
  State,
  HandlerCallback,
  ModelType,
} from "@elizaos/core";

interface ResearchTask {
  id: string;
  query: string;
  source: "twitter" | "github" | "web";
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
}

interface SwarmResearchParams {
  originalQuery: string;
  tasks: ResearchTask[];
}

const swarmResearchAction: Action = {
  name: "SWARM_RESEARCH",
  description: "Delegate research to multiple sub-agents and synthesize results",
  similes: ["research", "investigate", "deep dive", "find out", "look up"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const text = message.content.text?.toLowerCase() || "";
    return text.includes("research") || 
           text.includes("find") || 
           text.includes("what is") ||
           text.includes("how to") ||
           text.includes("best");
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
  ): Promise<void> => {
    const query = message.content.text || "";

    callback?.({
      text: `🔍 Starting swarm research on: "${query}"\nDelegating to 3 specialist agents...`,
    });

    // Step 1: Break down query into parallel tasks using LLM
    const taskPrompt = `Break down this research query into 3 specific sub-queries for different sources:

Query: "${query}"

Create exactly 3 research tasks:
1. Twitter/X search - for recent discussions and sentiment
2. GitHub search - for repositories and code implementations  
3. Web search - for documentation and general information

Respond with a JSON object in this format:
{
  "tasks": [
    {"id": "1", "source": "twitter", "query": "..."},
    {"id": "2", "source": "github", "query": "..."},
    {"id": "3", "source": "web", "query": "..."}
  ]
}`;

    const taskResult = await runtime.useModel(ModelType.OBJECT_SMALL, {
      prompt: taskPrompt,
    }) as SwarmResearchParams;

    const tasks: ResearchTask[] = taskResult.tasks || [];

    // Step 2: Execute parallel research tasks
    const results = await Promise.all(
      tasks.map((task) => executeResearchTask(runtime, task, query))
    );

    // Step 3: Synthesize results
    const synthesisPrompt = `Synthesize these research findings into a clear, actionable response.

Original Query: ${query}

Research Results:
${results.map((r) => `[${r.source.toUpperCase()}]: ${r.result}`).join("\n\n")}

Provide a comprehensive answer that combines insights from all sources. Highlight key findings and any conflicting information.`;

    const finalAnswer = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt: synthesisPrompt,
    }) as string;

    callback?.({
      text: `📊 Research Complete\n\n${finalAnswer}`,
    });
  },

  examples: [
    [
      {
        name: "{{user1}}",
        content: { text: "Research the best AI coding tools for 2025" },
      },
      {
        name: "Shane",
        content: {
          text: "🔍 Starting swarm research...",
        },
      },
    ],
  ],
};

async function executeResearchTask(
  runtime: IAgentRuntime,
  task: ResearchTask,
  originalQuery: string
): Promise<ResearchTask & { result: string }> {
  const researchPrompts: Record<string, string> = {
    twitter: `Search Twitter/X for recent discussions about: ${task.query}. Summarize the sentiment and key points from the last 30 days.`,
    github: `Search GitHub for repositories related to: ${task.query}. List the top 3 repos with stars, description, and recent activity.`,
    web: `Search the web for: ${task.query}. Provide a comprehensive summary from recent articles and documentation.`,
  };

  const result = await runtime.useModel(ModelType.TEXT_SMALL, {
    prompt: researchPrompts[task.source] || researchPrompts.web,
  }) as string;

  return { ...task, result, status: "completed" };
}

export default swarmResearchAction;