# SwarmResearch Plugin for ElizaOS

A multi-agent research coordination plugin for ElizaOS that enables parallel research across Twitter, GitHub, and web sources.

## Overview

SwarmResearch allows ElizaOS agents to perform sophisticated research by delegating to specialized sub-agents:

1. **Query Analysis** - Breaks down complex queries into parallel research tasks
2. **Parallel Execution** - Dispatches tasks to Twitter, GitHub, and web specialists simultaneously
3. **Result Synthesis** - Aggregates findings into a coherent, actionable response

## Installation

```bash
npm install @elizaos/plugin-swarm-research
```

## Usage

Add to your character configuration:

```json
{
  "name": "ResearchBot",
  "plugins": ["@elizaos/plugin-swarm-research"],
  "settings": {
    "swarm": {
      "maxConcurrentTasks": 3,
      "timeoutMs": 30000
    }
  }
}
```

## How It Works

When a user asks: *"Research the best AI coding tools for 2025"*

1. **SwarmCoordinator** breaks this into 3 parallel tasks:
   - Twitter agent: Recent discussions and sentiment
   - GitHub agent: Top repositories and technical implementations
   - Web agent: Documentation and comprehensive reviews

2. Each specialist agent executes independently

3. Results are synthesized into a final answer with sources

## API

### Actions

- `SWARM_RESEARCH` - Main action triggered by research queries

### Services

- `SwarmCoordinatorService` - Coordinates parallel task execution

### Providers

- `swarmResultsProvider` - Access to recent research context

## Development

```bash
cd packages/plugin-swarm-research
npm install
npm run build
```

## License

MIT