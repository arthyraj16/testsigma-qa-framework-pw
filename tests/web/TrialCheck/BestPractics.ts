/*
Login Functionality Test Principles:
1. Avoid hardcoding sensitive information like URLs, usernames, and passwords directly in test scripts.
2. Use environment variables or configuration files to manage sensitive data securely.
3. Implement a secure method for storing and retrieving credentials, such as using a secrets manager or encrypted storage.
4. Ensure that test scripts are maintainable and reusable by separating configuration from test logic.
5. Follow best practices for test automation, including clear naming conventions, modular design, and comprehensive error handling.
6. Different environments, same code (your CI question)  
as Testsigma's own Environments/Global Parameters feature you demo to clients — you never tell them to hardcode URLs and passwords into test steps; same logic, same reason.

*/