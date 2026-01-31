import {
  Action,
  Memory,
  State,
  HandlerCallback,
  IAgentRuntime,
  ModelClass,
  generateObject,
  composeContext,
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

const swarmResearchTemplate = `
You are a research coordinator. Break down the user's query into 3 parallel research tasks.

User Query: {{query}}

Create exactly 3 research sub-queries targeting different sources:
1. Twitter/X - for recent discussions and sentiment
2. GitHub - for code repositories and technical implementations
3. Web - for general information and documentation

Respond in this exact JSON format:
{
  "tasks": [
    {"id": "1", "source": "twitter", "query": "..."},
    {"id": "2", "source": "github", "query": "..."},
    {"id": "3", "source": "web", "query": "..."}
  ]
}`;

const synthesisTemplate = `
You are a research synthesizer. Combine the results from multiple sources into a coherent answer.

Original Query: {{query}}

Research Results:
{{results}}

Synthesize these findings into a clear, actionable response. Highlight key insights and any conflicting information.`;

export const swarmResearchAction: Action = {
  name: "SWARM_RESEARCH",
  description: "Delegate research to multiple sub-agents and synthesize results",
  similes: ["research", "investigate", "deep dive", "find out", "look up"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const text = message.content.text.toLowerCase();
    return text.includes("research") || 
           text.includes("find") || 
           text.includes("what is") ||
           text.includes("how to") ||
           text.includes("best");
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: any,
    callback: HandlerCallback
  ) => {
    const query = message.content.text;

    // Get or initialize coordinator service
    const coordinator = await runtime.getService("swarm-coordinator");
    
    // Step 1: Break down query into parallel tasks
    const context = composeContext({
      template: swarmResearchTemplate,
      state: { query },
    });

    const taskBreakdown = await generateObject({
      runtime,
      context,
      modelClass: ModelClass.SMALL,
    });

    callback({
      text: `🔍 Starting swarm research on: "${query}"\nDelegating to 3 specialist agents...`,
      action: "SWARM_RESEARCH_START",
    });

    // Step 2: Execute parallel research tasks
    const tasks: ResearchTask[] = taskBreakdown.tasks;
    const results = await Promise.all(
      tasks.map((task) => executeResearchTask(runtime, task, query))
    );

    // Step 3: Synthesize results
    const synthesisContext = composeContext({
      template: synthesisTemplate,
      state: {
        query,
        results: results.map((r) => `[${r.source}]: ${r.result}`).join("\n\n"),
      },
    });

    const finalAnswer = await generateText({
      runtime,
      context: synthesisContext,
      modelClass: ModelClass.MEDIUM,
    });

    callback({
      text: `📊 Research Complete\n\n${finalAnswer}`,
      action: "SWARM_RESEARCH_COMPLETE",
      sources: results.map((r) => ({ source: r.source, query: r.query })),
    });

    return true;
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Research the best AI coding tools for 2025" },
      },
      {
        user: "{{agent}}",
        content: {
          text: "🔍 Starting swarm research...",
          action: "SWARM_RESEARCH",
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
  // Simulate research execution (in production, this calls actual APIs)
  const researchPrompts: Record<string, string> = {
    twitter: `Search Twitter for recent discussions about: ${task.query}. Summarize the sentiment and key points from the last 30 days.`,
    github: `Search GitHub for repositories related to: ${task.query}. List the top 3 repos with stars, description, and recent activity.`,
    web: `Search the web for: ${task.query}. Provide a comprehensive summary from recent articles and documentation.`,
  };

  const result = await generateText({
    runtime,
    context: researchPrompts[task.source],
    modelClass: ModelClass.SMALL,
  });

  return { ...task, result, status: "completed" };
}