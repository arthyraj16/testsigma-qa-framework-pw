/*

Not in cursor.
GitHub is like Google Drive for your code. A cloud platform to store, manage, and collaborate on code.
Your PWDemos project → pushed to GitHub repo
→ Team can see your Playwright scripts
→ CI/CD can auto-run tests on every commit

Github Copilot - GitHub (owned by Microsoft) + OpenAI (GPT model) = GitHub Copilot
        - An AI assistant built on top of GitHub that helps you write code faster inside your editor.
        - GitHub is the library. Copilot is the smart librarian sitting next to you suggesting what to read/write next.
Copilot = AI inside your editor. 

GitHub (platform)
    └── stores your code
    └── tracks changes
    └── runs CI/CD pipelines
    └── GitHub Copilot (AI layer on top)
            └── suggests code while you type
            └── generates tests
            └── explains & fixes code

            

Github Copilot:
LLM - GPT-4o ⚠️ borrowed  // uses OpenAI as their LLM
Agent - Copilot Agent / Workspace
company - GitHub/Microsoft 
they build their own MCP (as per their purposes)- GitHub MCP Server 

OpenAI (GPT model): GPT means Generative Pre-trained Transformer
LLM - GPT-4o / GPT-5 ✅ own
Agent - ChatGPT Agent / Operator
company - OpenAI
they build their own MCP (as per their purposes)- OpenAI MCP Server 

How does it work: 
GPT-4o  LLM   →  understands what you want
Copilot Agent →  plans the best suggestion
GitHub MCP    →  reads YOUR code for context
Result        →  It's not just generic code generation — it learns your specific codebase and 
                 suggests code that fits your exact style and patterns.
Note: 
    Few LLMs like claude, deepseek, google gemini,chatgpt cant be integrated with IDE.(vs code here for pw)
    But Github Copilot pluggin / extension can be integrated/ installed with vs code IDE, it can be used just like LLM(claude)

Advantagees of using github copilot:
    - helps to generate code.
    - fixes the logical/syntactical issues  

    ***********However , Github copilot auto enabled in this vs code IDE.**********


Playwright MCP - 
A Model Context Protocol server that provides browser automation capabilities using Playwright. Playwright 
MCP is a tool that lets an AI (like Claude) control a real browser and interact with websites — without needing to see screenshots.

How does it work: 
MCP connects Claude to a real browser. 
Claude does All the things Playwright normally does But now Claude does it automatically. 
claude interacts with websites without any need to take a screenshot and analyse it visually

LLM - External (Claude/GPT/Gemini) 
Agent - Claude Code / Cursor / Copilot
company - Microsoft 
they build their own MCP (as per their purposes)- Playwright MCP (Microsoft) 


Real Workflow Together - Gihub Copilot + Playwright MCP 
Step 1: You open VS Code
        ↓
Step 2: GitHub Copilot (inside VS Code)
        → suggests Playwright test code as you type
        → you accept, refine, build your test suite
        ↓
Step 3: Playwright MCP (connected to Claude)
        → you describe what to test in plain English
        → Claude opens browser and runs it live
        → you see exactly what happens in real browser
        ↓
Step 4: Back to VS Code with Copilot
        → Claude's findings help you write better assertions
        → Copilot suggests fixes based on what you learned

Steps: 
        npm init playwright@latest 
        extension -> pw vs code extension install
        Pw mcp install - 
        install the Playwright MCP server with your client(it will execute the code). https://github.com/microsoft/playwright-mcp  
        Click on install server-> vs code and it reopens the vs code with the playwright mcp server to install -> click on install. (it ran this  npm install -D @playwright/mcp  automatically)
       


Vibe Coding: "Vibe coding" is a term (popularized by Andrej Karpathy in early 2025) for a style of coding where you describe what you want in natural language and let an AI model generate the code, without carefully reading, reviewing, or fully understanding every line it produces. 
You just go with the "vibe" — iterating by describing bugs or new features in plain English        
        
Web Testing: How to generate & execute Playwright test code using LLM + Agent + MCP for web testing in a real browser.
        1. Create a text context file for the application under project root.
        2. In the chat session, provide @context <context_file_name> to load the context file. Provide the vibe coding prompt to the LLM. The LLM will generate the test code based on the context file and your prompt.
        3. Provide permissions to the LLM to access the MCP server. The LLM will use the MCP server to execute the generated test code in a real browser.
        4. The LLM will return the test results and any errors encountered during execution. You can then provide feedback to the LLM to refine the test code or fix any issues.
        5. Repeat steps 2-4 as needed to iterate on the test code and achieve the desired test coverage and quality.
        6. If it fails, you can provide feedback to the LLM to fix the issues and rerun the test code. The LLM will use the MCP server to execute the updated test code in a real browser and return the results.
        7. First time of execution LLM execution, it fails. Then rerun and then it works.

Prompt to use sample:
Using the instructions in @file:webtextcontext.txt

Generate a Playwright test for the following scenario:

Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
Enter username "Admin" and password "admin123"
Click the Login button
Verify the dashboard page loads successfully (check for "Dashboard" heading or URL contains "dashboard")


How to generate Page object model code using LLM + Agent + MCP for web testing in a real browser.
        1. We need not write any context file for the application. Just provide the vibe coding prompt to the LLM. The LLM will generate the page object model code based on your prompt.
Prompt to use sample:

Create a page object model for the following scenario:
Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
Enter username "Admin" and password "admin123"
Click the Login button
Verify the dashboard page loads successfully (check for "Dashboard" heading or URL contains "dashboard")
Export the test to a `.spec.ts` file under the `/tests` folder.

        2. Provide permissions to the LLM to access the MCP server. The LLM will use the MCP server to execute the generated page object model code in a real browser.
        3. It creates pages folder and generates the page object model code inside it. It also creates a test file that uses the page object model to perform the login and verify the dashboard page loads successfully.



API Testing: How to generate & execute Playwright test code using LLM + Agent + MCP for API testing.
        1. Create a text context file for the API under project root.
        2. In text context file, provide the API endpoint, request method, request headers, request body, and expected response validations.
        3. To validate schema, provide the JSON schema for the expected response. //ajv package is required to validate the schema. (Install it using npm install ajv. which AI will do it)
        2. In the chat session, provide @context <context_file_name> to load the context file. Provide the vibe coding prompt to the LLM. The LLM will generate the test code based on the context file and your prompt. 

An API schema is a formal definition of the structure, data types, 
and rules that describe what a valid request or response for an API should look like.
this validataion needs to be done using ajv package. (Install it using npm install ajv. which AI will do it)

Prompt to use sample:
Using the instructions in @file:apitestcontext.txt

Generate a Playwright test for the following API scenario:   

1. Define the API endpoint URL: 'https://fakestoreapi.com/products/1'.
2. Send a GET request to the endpoint.
3. Verify the response status is 200.
4. Validate the response contains these keys: `id`, `title`, `price`, `category`, and `description`.
5. Optionally validate the data types using a JSON Schema (Ajv).
6. Log the product title and price to the console.     

Now, test file is created and executed successfully.

*/      

/*
What is AI Agent?
An AI agent is software that can think and act like a decision-maker, using AI Agents to solve problems or perform tasks automatically.
Real World Examples?

Voice Assistants: Siri / Alexa / Google Assistant:
Listens to your voice, understands your request, and gives a response or performs a task.
Self-driving car system:
Detects the road, obstacles, and traffic, then makes driving decisions (like braking or turning).

AI Agents are everywhere:
1. Chatbots: Automatically answer questions, provide information, or handle customer service.
2. Robots: Navigate environments, perform tasks, or assist with manufacturing.
3. Autonomous systems: Drive cars, fly drones, or control industrial processes.
4. Healthcare: Diagnose patients, suggest treatments, or monitor health.
5. Finance: Analyze data, make investment decisions, or manage portfolios.
6. Legal: Review documents, summarize information, or assist with legal research.
7. Education: Provide tutoring, answer questions, or create educational content.
8. Gaming: Make strategic decisions, solve puzzles, or engage in interactive experiences.



******* to refer for comparision:

Gen AI

Keyword: Creates
What it does: You ask, it writes. That's all.
Example: You ask ChatGPT "write a login test" → it writes code → done. It never opened a browser, never checked if the code works.


AI Agent

Keyword: Acts
What it does: Creates + uses tools + checks its own work.
Example: What you did this week — Cursor opened a real browser, typed "iPhone" in the search box, clicked Search, saw the results, then wrote the test. It didn't just write — it did things.


Agentic AI

Keyword: Team
What it does: Many agents working together on a big job.
Example: Testsigma's Atto — one agent plans the tests, another generates them, another runs them, another fixes broken ones. 25+ agents, each with a job, working as a team. You just approve at the end.

Gen AI writes the test. AI Agent writes and runs it. Agentic AI is a whole QA team of agents doing everything.
*/