/*
AI - Aritifical Intelligence - this mimics the human intelligence (be it how we work, how we respond with people, how we make decisions)
   - The same tasks are performed using AI tools. We ask AI tools it responses back. 

How Does AI Work?
AI often uses data and algorithms to learn and improve. The most common method is:

Machine Learning (ML): AI learns from data (e.g., showing it 1,000 car pictures so it learns what a car looks like).
A subset is Deep Learning, which uses artificial "neural networks" inspired by the human brain. Example: Voice assistants, Self driving cars etc. (alexa, google assistant, samsung bixby)  

Prompts / Prompting - The way of providing details to get the response from AI tools.

*******************************************************************************************************************
Internet - The internet is a global network of computers and devices connected together, allowing them to communicate and share information with each other
LLM - Large Language Model - It is a system trained with huge data in the internet. Works just like a chat. 
                           - When we ask something using the huge data that LLM is trained with, it provides the response to the user & remembers the history of the previous queries & responses.
                           - It is basically content generator / content creator (as it uses the trained content in background)
                           - There are multiple LLM tools are available in the market.
                           - Eg: chatgpt,claude deepseek,google gemini are popular LLMs 
                           - Based on the tasks, we need to opt for the right LLM
Limitations of LLM - In Tester perspective; LLMs can generate content. But it cannot execute the content. It is great at thinking but not at doing actions.
                           - LLMs can generate test cases. But it cannot execute the test cases.
                           - it cannot launch browser, cannot interact with the elements.
                           - it cannot interact with databases.(Query your database)
                           - it cannot send the API request and get the real time reponses (execution involved in bg)
                           - it cannot interact with the backend systems
                           - it cannot interact with you local storage or local data sources (Read your files)
                           - it cannot Check your calendar
                           - it cannot Create a Jira ticket
                           - it cannot Send a Slack message

Sample Response for test execution:                           
"Claude responded: I can't directly open a browser or click on websites myself — I can only help you write automation code or guide manual execution.
I can't directly open a browser or click on websites myself — I can only help you write automation code or guide manual execution."

Sample Response for call API: LLM itself cannot browse or call APIs. LLM(brain) + Tools (hands)

You asked → 
  Claude (LLM) wrote the Node.js script → 
    bash_tool executed it in a Linux container → 
      Node.js made the actual HTTP request → 
        Response came back → 
          Claude read it and showed you

*******************************************************************************************************************
To overcome this problem statement, 
    - We need Agent. LLM + Agent - will be able to perform the actions.
    - Major difference between LLM and Agent: It can execute any tasks.(that cannot be done with LLM)
    - Agent (mediator) needs some component (MCP) to complete the action 
Agent: An agent is a system or program that takes the instruction from an LLM and performs real world tasks using tools(MCP).
It acts as helper that does things the LLM cannot do on its own.

*******************************************************************************************************************
MCP - Model Context Protocol 
    - LLM performs the tasks using MCP through Agent. 
    - You have to manage the context, model, flow of data between app and model.
    - Anybody can design their own MCPs
    - this is the main core component that interacts with the browser to perform the actions on the elements. Apis call & db query are can be done through MCP.
    - MCP are frmaework that connects to the LLMs to the real world tools like (browsers,db,apis)
    - Given propoer permission MCPs can access the local data / db installed in your local machine.
    - Hence, MCPs connects LLM to the browsers/databases/Apis through Agent.
    - models are the ones that are used to perform the tasks.  capability tiers are different for each model.
    For eg: 
    | Tier    | Strength             | Typical use                          |
|---------|----------------------|--------------------------------------|
| Fable 5 | Highest intelligence | Complex reasoning, hardest problems  |
| Opus    | Very high            | Deep coding, long complex tasks      |
| Sonnet  | Balanced             | Everyday coding assistants, chat     |
| Haiku   | Fast & cheap         | High-volume/simple automation        |

Examples of What MCP Can Do
1. Browser Automation → Open a website, fill a form, click a button
                        Done via tools like Selenium MCP or Playwright MCP
2. Database Operations → Connect to MySQL or PostgreSQL and run queries
                         Done via PostgreSQL MCP or MySQL MCP
3. API Requests → Send or receive API responses
                  Handled by MCP to get real-time results

MCP Server:
        - MCP Server is the server that runs the MCP.


LLM - Claude 
Agent - Claude Code 
company - anthropic 
they build their own MCP (as per their purposes)- anthropic MCP

LLM - Testsigma's built-in AI (powered by OpenAI/internal) 
Agent - ATTO
company - Testsigma 
they build their own MCP (as per their purposes)- Testsigma MCP (needs to be built/exposed) // not aware 

LLM - External (Claude/GPT/Gemini) 
Agent - Claude Code / Cursor / Copilot
company - Microsoft 
they build their own MCP (as per their purposes)- Playwright MCP (Microsoft) 

User --> Prompts --> LLM --> Agent --> MCP

*******************************************************************************************************************

Crisp: 
LLM: A very smart brain that reads and generates text.
Analogy: A genius professor locked in a room. You pass notes under the door, they write brilliant answers back. But they can't call anyone, open any file, or do anything outside that room.
Agent: The same smart brain, but now given the ability to take actions — decide what to do next, use tools, and complete multi-step tasks on its own.
Analogy: Same genius professor, but now they have a to-do list, can make decisions, and can ask assistants to go fetch things for them. They don't just answer — they get things done.
MCP: The connector/bridge that gives the agent access to real external tools and systems — files, apps, APIs, databases.
Analogy: The set of keys, phone, and computer given to the professor so they can actually access the outside world — read emails, open files, update spreadsheets, message colleagues.

*/

/*
2026 data
LLM                          | Company     | Free Plan        | Paid Plan              | Open Source | Best For
-----------------------------|-------------|------------------|------------------------|-------------|-----------------------------
Claude (Sonnet 4.6/Opus 4.7) | Anthropic   | Yes (limited)    | Pro $20/mo, Max $100+  | No          | Coding, reasoning, agents
ChatGPT (GPT-5.5)            | OpenAI      | Yes (capped)     | Plus $20, Pro $100-200 | No          | General use, coding, research
Gemini (2.5/3 Flash)         | Google      | Yes (free tier)  | Google One plans       | No          | Multimodal, fast, budget API
DeepSeek V3.2                | DeepSeek    | Yes (web)        | API $0.14/M tokens     | Yes         | Best value, cheap + strong
Llama 4                      | Meta        | Yes (self-host)  | Free via API providers | Yes         | Self-hosted, privacy, no cost
Mistral (Large 3)            | Mistral AI  | Yes (free tier)  | API from $0.10/M       | Partial     | European alt, multilingual
Grok 4.3                     | xAI         | Yes (via X)      | X Premium subscription | No          | Real-time search, X platform
Gemma 3                      | Google      | Yes (free)       | Free via OpenRouter    | Yes         | Lightweight, on-device
Qwen 2.5                     | Alibaba     | Yes (free)       | API $0.05/M tokens     | Yes         | Cheapest multimodal

ACCESS TYPE SUMMARY:
- Completely Free (self-host) : Llama 4, DeepSeek R1, Gemma 3, Qwen 2.5
- Free tier + Paid upgrade    : Claude, ChatGPT, Gemini, Grok, Mistral
- Cheapest API                : DeepSeek V3.2 at $0.14/M tokens
- Most capable (frontier)     : Claude Opus 4.7, GPT-5.5

FOR QA / TESTSIGMA USE:
- Free daily use   → Claude free tier or ChatGPT free
- Best for coding  → Claude Pro ($20/month)
- Best free API    → DeepSeek or Llama 4 via OpenRouter
*/