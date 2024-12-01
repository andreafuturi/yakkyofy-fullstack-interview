# Yakkyo fullstack test

## 🎯 Solution Overview

I approached this challenge with a focus on code best practices, scalability, and maintainability.
I took some breaks between tasks to think about the best approach, but in general I think it took me around 3 to 4 hours.
Since I had time unitl 2/12/2024 I decided to focus on quality rather than speed.

### 🐳 Docker & Infrastructure
- Used named volumes for data persistence
- Configured proper networking between services
- Clean and modular separated Dockerfiles for each service
- Use of alpine images for minimal footprint and performance

### 🏗️ Architecture Highlights
1. **Modular Design**
   - Separated concerns into clear domains
   - Used composables for reusable Vue.js logic
   - Implemented proper TypeScript interfaces and types

2. **Error Handling**
   - Implemented rollback mechanisms for failed operations
   - Added proper error states in UI with user feedback following best practices

3. **Code Quality**
   - Well documented code with comments
   - Clear and readable code
   - Meaningful tags, variable and function names



### 🔧 Challenges & Solutions

1. **Puppeteer Compatibility**
   - Puppeteer requires more configuration for dockerized environments
   - I decided to use directly chromium for cleaner Dockerfile

2. **Performance Considerations**
   - Added timeout handling for long-running operations
   - Implemented proper cleanup mechanisms

### 🔎 File Naming Convention
I dedided to name the files more or less following the convention of the project, but I also added a prefix to each file name to better identify the file purpose.
This way we have less files with the same name and we can easily identify the file purpose by just looking at the file name.

## 🚀 Future Improvements

1. **Scaling**
   - Add load balancing support
   - Add automated tests for easier refactoring
   - Add more types constraints especially in the controller
   - Improve error handling
   - Centralize all statuses in a single source of truth costant    

2. **Monitoring**
   - Add proper logging infrastructure
   - Implement metrics collection
   - Add performance monitoring
   - Add api versioning

3. **Features**
   - Implement real cancel of requests
   - Add custom viewport sizes
   - Debouncing screenshot requests to prevent server's overload
   - Add a limit to polling retries
   - Use a WebSocket connection or Server-Sent Events for real-time updates
   - Add failed status to better reflect any error presence
   - Add docker's prod configuration (healthcheck, deploy resource limits, multistage build, etc...)

## 🏃‍♂️ Getting Started

1. Clone the repository
```bash
git clone https://github.com/andreafuturi/yakkyofy-fullstack-interview/
```

2. Rename .env.example to .env and configure the environment variables

3. Build and run the app
```bash
docker compose up --build
```
## 🤖 Usage of AI Tools

I used AI tools to help me with the following tasks:
- Generate documentation
- Generate commit messages
- Generate code with autocompletion

I didn't use AI to generate entire code sections or solve major parts of the test. 
And I double checked and customized all the generated code to better fit the project needs.

## Conclusion

The part where I had more difficulties was to manage the dockerized environment in a clean and maintainable way, but in the end I think it was a good excercise to learn more about Docker.
Everything else was pretty straightforward and I enjoyed working on it!

I'm looking forward to the next step! 🚀