# Pension Calculator

A full-stack web application for calculating pension and investment projections, built with React/TypeScript frontend and .NET 8 Azure Functions backend.

## Technologies Used

### Frontend
- **React 18** with TypeScript - Component-based architecture
- **Chart.js** with react-chartjs-2 - Interactive data visualizations
- **TypeScript** - Type-safe development
- **Jest Testing Library** - Unit testing (Coverage: 61.71%)
- **ESLint** - Code quality and standards

### Backend
- **ASP.NET Core (.NET 8)** - Azure Functions serverless architecture
- **Azure Table Storage** - NoSQL data persistence
- **FluentValidation** - Input validation and business rules
- **Application Insights** - Monitoring and telemetry
- **Azure Functions Worker** - HTTP APIs and serverless computing

## Architecture

This application follows a modern full-stack architecture:

- **Frontend**: React SPA with TypeScript serving responsive UI components
- **Backend**: Serverless Azure Functions providing RESTful APIs
- **Storage**: Azure Table Storage for scalable data persistence
- **Deployment**: Azure cloud services integration

## Key Features

- **Interactive Pension Calculations** - Real-time pension projection calculations
- **Data Visualization** - Charts and graphs for financial projections
- **Responsive Design** - Mobile-first approach with modern UI components
- **Type Safety** - Full TypeScript implementation across frontend
- **Cloud Integration** - Azure-native architecture for scalability
- **Input Validation** - Comprehensive validation using FluentValidation
- **Testing** - Unit tests with React Testing Library, Xunit and NSubstitute

## Technical Highlights

### Frontend Development
- Built responsive UI components from scratch using modern React patterns
- Implemented TypeScript for type safety and better developer experience
- Integrated Chart.js for interactive data visualizations
- Applied component-based architecture with reusable modules
- Configured ESLint for code quality and consistency

### Backend Development
- Developed RESTful APIs using ASP.NET Core Azure Functions
- Implemented serverless architecture for cost-effective scaling
- Used Azure Table Storage for efficient data operations
- Applied FluentValidation for robust input validation
- Integrated Application Insights for monitoring and telemetry

### Cloud & DevOps
- Deployed on Azure Functions for serverless computing
- Configured Azure Table Storage for NoSQL data persistence
- Implemented proper environment configuration management
- Set up monitoring and logging with Application Insights

## Development Setup

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- Azure Functions Core Tools
- Azure Storage Account

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd api
dotnet restore
func start
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd api/Tests/
dotnet test
```

## Performance & Scalability

- **Serverless Architecture**: Azure Functions provide automatic scaling
- **Efficient Data Access**: Azure Table Storage for fast NoSQL operations
- **Optimized Frontend**: React 18 with modern bundling and optimization
- **Type Safety**: TypeScript reduces runtime errors and improves maintainability

## Security & Best Practices

- Input validation using FluentValidation
- TypeScript for compile-time error detection
- Azure security features and managed services
- Proper error handling and logging

## Live Demo

[https://pension-vs-index-calculator.com/](https://pension-vs-index-calculator.com/)
