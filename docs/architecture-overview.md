# Architecture Overview

This document provides a comprehensive overview of the Portfolio Blog 2025 architecture, including system design, data flow, and architectural patterns.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Architecture](#database-architecture)
5. [API Architecture](#api-architecture)
6. [Deployment Architecture](#deployment-architecture)

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Edge Layer"
        CDN[Vercel Edge Network]
        MW[Edge Middleware]
    end
    
    subgraph "Application Layer"
        subgraph "Next.js App"
            RSC[React Server Components]
            SSG[Static Pages]
            API[API Routes]
            Admin[Admin Panel]
        end
    end
    
    subgraph "Data Layer"
        subgraph "Payload CMS"
            LocalAPI[Local API]
            REST[REST API]
            GQL[GraphQL API]
            Auth[Auth System]
        end
    end
    
    subgraph "Database Layer"
        Neon[(Neon PostgreSQL)]
        Cache[(Redis Cache)]
    end
    
    subgraph "Storage Layer"
        S3[S3/Blob Storage]
        Local[Local Storage]
    end
    
    Browser --> CDN
    Mobile --> CDN
    CDN --> MW
    MW --> RSC
    MW --> SSG
    RSC --> LocalAPI
    API --> LocalAPI
    Admin --> REST
    Admin --> GQL
    LocalAPI --> Neon
    REST --> Neon
    GQL --> Neon
    LocalAPI --> Cache
    Admin --> S3
```

### Component Architecture

```mermaid
graph LR
    subgraph "Presentation Layer"
        UI[UI Components]
        Blocks[Content Blocks]
        Forms[Dynamic Forms]
    end
    
    subgraph "Business Logic"
        Hooks[Custom Hooks]
        Utils[Utilities]
        Valid[Validation]
    end
    
    subgraph "Data Access"
        Collections[Collections]
        Globals[Globals]
        Media[Media Handler]
    end
    
    subgraph "Infrastructure"
        DB[Database Adapter]
        Storage[Storage Adapter]
        Email[Email Service]
    end
    
    UI --> Hooks
    Blocks --> Utils
    Forms --> Valid
    Hooks --> Collections
    Utils --> Globals
    Valid --> Media
    Collections --> DB
    Globals --> DB
    Media --> Storage
```

## Frontend Architecture

### Component Hierarchy

```mermaid
graph TD
    App[App Root]
    App --> Providers[Providers]
    App --> Layout[Layout]
    
    Providers --> Theme[ThemeProvider]
    Providers --> Header[HeaderThemeProvider]
    
    Layout --> AdminBar[AdminBar]
    Layout --> HeaderComp[Header]
    Layout --> Main[Main Content]
    Layout --> Footer[Footer]
    
    Main --> Pages[Dynamic Pages]
    Main --> Posts[Blog Posts]
    Main --> Search[Search]
    
    Pages --> Hero[Hero Section]
    Pages --> Blocks[Content Blocks]
    
    Blocks --> CTA[CallToAction]
    Blocks --> Content[Content]
    Blocks --> Media[MediaBlock]
    Blocks --> Archive[Archive]
    Blocks --> Form[FormBlock]
```

### Data Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant CDN
    participant NextJS
    participant RSC as React Server Component
    participant PayloadAPI
    participant Database
    
    User->>Browser: Navigate to page
    Browser->>CDN: Request page
    CDN->>CDN: Check cache
    
    alt Cache Miss
        CDN->>NextJS: Forward request
        NextJS->>RSC: Render component
        RSC->>PayloadAPI: Local API call
        PayloadAPI->>Database: Query data
        Database-->>PayloadAPI: Return data
        PayloadAPI-->>RSC: Return formatted data
        RSC-->>NextJS: Return HTML
        NextJS-->>CDN: Cache & return
    end
    
    CDN-->>Browser: Return HTML
    Browser-->>User: Display page
```

### Frontend State Management

```mermaid
stateDiagram-v2
    [*] --> ThemeProvider
    ThemeProvider --> LightTheme
    ThemeProvider --> DarkTheme
    
    LightTheme --> UserInteraction
    DarkTheme --> UserInteraction
    
    UserInteraction --> LocalStorage
    LocalStorage --> ThemeProvider
    
    state HeaderTheme {
        [*] --> Default
        Default --> Transparent
        Transparent --> Solid
        Solid --> Default
    }
```

## Backend Architecture

### Payload CMS Architecture

```mermaid
graph TB
    subgraph "Payload Core"
        Config[Payload Config]
        Collections[Collections]
        Globals[Globals]
        Fields[Field Types]
    end
    
    subgraph "Business Logic Layer"
        Hooks[Hooks System]
        Access[Access Control]
        Validation[Validation]
        Migration[Migrations]
    end
    
    subgraph "API Layer"
        LocalAPI[Local API]
        RestAPI[REST API]
        GraphQL[GraphQL API]
    end
    
    subgraph "Admin UI"
        AdminPanel[Admin Panel]
        LivePreview[Live Preview]
        Forms[Form Builder]
    end
    
    subgraph "Database Abstraction"
        Adapter[DB Adapter]
        Drizzle[Drizzle ORM]
        Transactions[Transactions]
    end
    
    Config --> Collections
    Config --> Globals
    Collections --> Fields
    Globals --> Fields
    
    Collections --> Hooks
    Collections --> Access
    Collections --> Validation
    
    Hooks --> LocalAPI
    Access --> LocalAPI
    Validation --> LocalAPI
    
    LocalAPI --> Adapter
    RestAPI --> LocalAPI
    GraphQL --> LocalAPI
    
    AdminPanel --> RestAPI
    LivePreview --> LocalAPI
    Forms --> RestAPI
    
    Adapter --> Drizzle
    Drizzle --> Transactions
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant NextJS
    participant Middleware
    participant PayloadAPI
    participant Hooks
    participant AccessControl
    participant Validation
    participant Database
    
    Client->>NextJS: HTTP Request
    NextJS->>Middleware: Process request
    Middleware->>PayloadAPI: Route to API
    
    PayloadAPI->>AccessControl: Check permissions
    AccessControl->>AccessControl: Evaluate rules
    
    alt Access Denied
        AccessControl-->>Client: 403 Forbidden
    else Access Granted
        AccessControl->>Hooks: beforeOperation
        Hooks->>Validation: Validate data
        
        alt Validation Failed
            Validation-->>Client: 400 Bad Request
        else Validation Passed
            Validation->>Database: Execute query
            Database-->>Hooks: afterOperation
            Hooks-->>PayloadAPI: Transform data
            PayloadAPI-->>Client: 200 Success
        end
    end
```

## Database Architecture

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ POSTS : creates
    USERS ||--o{ PAGES : creates
    POSTS }o--|| MEDIA : features
    POSTS }o--o{ CATEGORIES : belongs_to
    POSTS }o--o{ POSTS : relates_to
    PAGES }o--o{ MEDIA : contains
    FORMS ||--o{ FORM_SUBMISSIONS : receives
    
    USERS {
        uuid id PK
        string email UK
        string password
        string name
        timestamp created_at
        timestamp updated_at
    }
    
    POSTS {
        uuid id PK
        string title
        string slug UK
        json content
        uuid hero_image FK
        string status
        timestamp published_at
        uuid author FK
        timestamp created_at
        timestamp updated_at
    }
    
    PAGES {
        uuid id PK
        string title
        string slug UK
        json hero
        json layout
        json meta
        string status
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIES {
        uuid id PK
        string title
        string slug UK
        uuid parent FK
        timestamp created_at
        timestamp updated_at
    }
    
    MEDIA {
        uuid id PK
        string filename
        string mime_type
        integer filesize
        json sizes
        string alt
        json caption
        timestamp created_at
        timestamp updated_at
    }
    
    FORMS {
        uuid id PK
        string title
        json fields
        json emails
        string confirmation_type
        timestamp created_at
        timestamp updated_at
    }
    
    FORM_SUBMISSIONS {
        uuid id PK
        uuid form_id FK
        json data
        timestamp submitted_at
    }
```

### Database Transaction Flow

```mermaid
sequenceDiagram
    participant API
    participant Adapter
    participant Drizzle
    participant PostgreSQL
    participant Transaction
    
    API->>Adapter: Begin operation
    Adapter->>Drizzle: Start transaction
    Drizzle->>PostgreSQL: BEGIN
    PostgreSQL->>Transaction: Create transaction
    
    loop Database Operations
        API->>Adapter: Execute query
        Adapter->>Drizzle: Build query
        Drizzle->>Transaction: Add to transaction
    end
    
    alt Success
        API->>Adapter: Commit
        Adapter->>Drizzle: Commit transaction
        Drizzle->>PostgreSQL: COMMIT
        PostgreSQL-->>API: Success
    else Error
        API->>Adapter: Rollback
        Adapter->>Drizzle: Rollback transaction
        Drizzle->>PostgreSQL: ROLLBACK
        PostgreSQL-->>API: Rolled back
    end
```

## API Architecture

### API Layer Structure

```mermaid
graph TD
    subgraph "API Endpoints"
        REST["/api/*"]
        GraphQL["/api/graphql"]
        Custom["/api/custom/*"]
    end
    
    subgraph "API Handlers"
        Collections[Collection Handlers]
        Globals[Global Handlers]
        Auth[Auth Handlers]
        Media[Media Handlers]
    end
    
    subgraph "Operations"
        Find[find/findByID]
        Create[create]
        Update[update/updateByID]
        Delete[delete/deleteByID]
    end
    
    subgraph "Middleware"
        AuthMW[Authentication]
        RateLimit[Rate Limiting]
        CORS[CORS Handler]
        Validate[Validation]
    end
    
    REST --> AuthMW
    GraphQL --> AuthMW
    Custom --> AuthMW
    
    AuthMW --> Collections
    AuthMW --> Globals
    AuthMW --> Auth
    AuthMW --> Media
    
    Collections --> Find
    Collections --> Create
    Collections --> Update
    Collections --> Delete
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant JWT
    participant Database
    participant Session
    
    Client->>API: POST /api/users/login
    API->>Database: Verify credentials
    Database-->>API: User data
    
    alt Valid Credentials
        API->>JWT: Generate token
        JWT-->>API: Access token
        API->>Session: Create session
        API-->>Client: 200 + Token
    else Invalid Credentials
        API-->>Client: 401 Unauthorized
    end
    
    Note over Client: Subsequent requests
    
    Client->>API: Request + Bearer token
    API->>JWT: Verify token
    
    alt Valid Token
        JWT-->>API: Decoded payload
        API->>Session: Get user data
        API-->>Client: 200 + Response
    else Invalid Token
        API-->>Client: 401 Unauthorized
    end
```

## Deployment Architecture

### Production Infrastructure

```mermaid
graph TB
    subgraph "Global Edge Network"
        Edge1[Edge Location 1]
        Edge2[Edge Location 2]
        Edge3[Edge Location N]
    end
    
    subgraph "Vercel Platform"
        subgraph "Serverless Functions"
            Func1[Function Instance 1]
            Func2[Function Instance 2]
            Func3[Function Instance N]
        end
        
        subgraph "Static Assets"
            Static[Next.js Static Files]
            Media[Media CDN]
        end
    end
    
    subgraph "Neon Database"
        Primary[(Primary Region)]
        Read1[(Read Replica 1)]
        Read2[(Read Replica 2)]
    end
    
    subgraph "External Services"
        S3[S3 Storage]
        Email[Email Service]
        Analytics[Analytics]
    end
    
    Edge1 --> Func1
    Edge2 --> Func2
    Edge3 --> Func3
    
    Func1 --> Primary
    Func2 --> Read1
    Func3 --> Read2
    
    Static --> Edge1
    Static --> Edge2
    Static --> Edge3
    
    Func1 --> S3
    Func2 --> Email
    Func3 --> Analytics
```

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "Development"
        Dev[Local Development]
        Test[Run Tests]
    end
    
    subgraph "Version Control"
        Git[Git Push]
        PR[Pull Request]
        Review[Code Review]
    end
    
    subgraph "CI Pipeline"
        Build[Build Project]
        Lint[Lint & Type Check]
        UnitTest[Unit Tests]
        IntTest[Integration Tests]
    end
    
    subgraph "CD Pipeline"
        Preview[Preview Deploy]
        ProdBuild[Production Build]
        Deploy[Deploy to Vercel]
    end
    
    subgraph "Post-Deploy"
        Migrate[Run Migrations]
        Cache[Warm Cache]
        Monitor[Start Monitoring]
    end
    
    Dev --> Test
    Test --> Git
    Git --> PR
    PR --> Review
    Review --> Build
    Build --> Lint
    Lint --> UnitTest
    UnitTest --> IntTest
    IntTest --> Preview
    Preview --> ProdBuild
    ProdBuild --> Deploy
    Deploy --> Migrate
    Migrate --> Cache
    Cache --> Monitor
```

## Performance Architecture

### Caching Strategy

```mermaid
graph TD
    subgraph "Cache Layers"
        Browser[Browser Cache]
        CDN[CDN Cache]
        NextCache[Next.js Cache]
        DBCache[Database Cache]
    end
    
    subgraph "Cache Keys"
        Page[Page Cache]
        API[API Response Cache]
        Query[Query Cache]
        Static[Static Asset Cache]
    end
    
    subgraph "Invalidation"
        OnDemand[On-Demand Revalidation]
        Time[Time-Based Revalidation]
        Tag[Tag-Based Revalidation]
    end
    
    Browser --> CDN
    CDN --> NextCache
    NextCache --> DBCache
    
    Page --> OnDemand
    API --> Time
    Query --> Tag
    Static --> CDN
```

## Security Architecture

### Security Layers

```mermaid
graph TB
    subgraph "Network Security"
        WAF[Web Application Firewall]
        DDoS[DDoS Protection]
        SSL[SSL/TLS Encryption]
    end
    
    subgraph "Application Security"
        Auth[Authentication]
        AuthZ[Authorization]
        CSRF[CSRF Protection]
        XSS[XSS Prevention]
    end
    
    subgraph "Data Security"
        Encrypt[Encryption at Rest]
        Transit[Encryption in Transit]
        Backup[Automated Backups]
    end
    
    subgraph "Access Control"
        RBAC[Role-Based Access]
        Field[Field-Level Security]
        Doc[Document-Level Security]
    end
    
    WAF --> Auth
    DDoS --> Auth
    SSL --> Auth
    
    Auth --> AuthZ
    AuthZ --> RBAC
    RBAC --> Field
    Field --> Doc
    
    Doc --> Encrypt
    Encrypt --> Transit
    Transit --> Backup
```

## Summary

This architecture provides:

1. **Scalability**: Serverless deployment with edge caching
2. **Performance**: Multiple caching layers and optimized data fetching
3. **Security**: Multi-layered security with granular access control
4. **Maintainability**: Clear separation of concerns and modular design
5. **Flexibility**: Adapter patterns for database and storage abstraction
6. **Developer Experience**: Type-safe APIs and comprehensive tooling

The architecture leverages modern patterns like:
- Server Components for optimal performance
- Edge computing for global distribution
- Database branching for isolated environments
- Incremental Static Regeneration for dynamic content
- Transaction-based operations for data integrity

This design ensures the application can scale from small blogs to enterprise-level content platforms while maintaining performance and developer productivity.
