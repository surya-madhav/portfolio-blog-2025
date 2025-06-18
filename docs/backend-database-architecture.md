# Backend & Database Architecture

This document provides a detailed exploration of the backend architecture, database design, and data flow patterns in the Portfolio Blog 2025 project.

## Table of Contents

1. [Backend Architecture Overview](#backend-architecture-overview)
2. [Database Design](#database-design)
3. [API Architecture](#api-architecture)
4. [Data Flow Patterns](#data-flow-patterns)
5. [Security Architecture](#security-architecture)
6. [Performance & Scaling](#performance--scaling)

## Backend Architecture Overview

### Payload CMS Architecture

```mermaid
graph TB
    subgraph "Configuration Layer"
        Config[payload.config.ts]
        Collections[Collection Configs]
        Globals[Global Configs]
        Plugins[Plugin System]
    end
    
    subgraph "Core Services"
        Auth[Authentication Service]
        Access[Access Control Engine]
        Validation[Validation Service]
        Hooks[Hooks System]
    end
    
    subgraph "Data Layer"
        ORM[Database Abstraction]
        Adapter[PostgreSQL Adapter]
        Drizzle[Drizzle ORM]
        Migrations[Migration System]
    end
    
    subgraph "API Layer"
        Local[Local API]
        REST[REST Endpoints]
        GraphQL[GraphQL Schema]
    end
    
    subgraph "Application Features"
        Versioning[Version Control]
        Media[Media Processing]
        Search[Search Engine]
        Forms[Form Handler]
    end
    
    Config --> Collections
    Config --> Globals
    Config --> Plugins
    
    Collections --> Auth
    Collections --> Access
    Collections --> Validation
    Collections --> Hooks
    
    Auth --> Local
    Access --> Local
    Validation --> Local
    Hooks --> Local
    
    Local --> ORM
    REST --> Local
    GraphQL --> Local
    
    ORM --> Adapter
    Adapter --> Drizzle
    Adapter --> Migrations
```

### Service Layer Architecture

```mermaid
classDiagram
    class PayloadService {
        +config: PayloadConfig
        +db: DatabaseAdapter
        +collections: CollectionService
        +globals: GlobalService
        +auth: AuthService
        +email: EmailService
        +init()
        +getAdminURL()
        +getAPIURL()
    }
    
    class CollectionService {
        +find()
        +findByID()
        +create()
        +update()
        +delete()
        +count()
    }
    
    class GlobalService {
        +findOne()
        +update()
    }
    
    class AuthService {
        +login()
        +logout()
        +refresh()
        +forgotPassword()
        +resetPassword()
        +verifyEmail()
    }
    
    class DatabaseAdapter {
        +connect()
        +disconnect()
        +transaction()
        +migrate()
    }
    
    PayloadService --> CollectionService
    PayloadService --> GlobalService
    PayloadService --> AuthService
    PayloadService --> DatabaseAdapter
```

## Database Design

### Schema Architecture

```mermaid
erDiagram
    %% Core Tables
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ POSTS : authors
    USERS ||--o{ PAGES : creates
    
    %% Content Tables
    POSTS }o--|| MEDIA : hero_image
    POSTS }o--o{ CATEGORIES : tagged_with
    POSTS }o--o{ POSTS : related_to
    POSTS ||--o{ POST_VERSIONS : versioned
    
    PAGES }o--o{ MEDIA : contains
    PAGES ||--o{ PAGE_VERSIONS : versioned
    
    %% Media Tables
    MEDIA ||--o{ MEDIA_SIZES : generates
    
    %% Form Tables
    FORMS ||--o{ FORM_FIELDS : contains
    FORMS ||--o{ FORM_SUBMISSIONS : receives
    
    %% Global Tables
    HEADER ||--o{ NAV_ITEMS : contains
    FOOTER ||--o{ NAV_ITEMS : contains
    
    %% Version Tables
    POST_VERSIONS }o--|| USERS : modified_by
    PAGE_VERSIONS }o--|| USERS : modified_by
```

### Detailed Table Schemas

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT false,
    locked_until TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Posts Table
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content JSONB NOT NULL,
    hero_image_id UUID REFERENCES media(id),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    author_id UUID REFERENCES users(id),
    meta JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_author ON posts(author_id);
```

#### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
```

#### Posts_Categories Junction Table
```sql
CREATE TABLE posts_categories (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (post_id, category_id)
);

CREATE INDEX idx_posts_categories_post ON posts_categories(post_id);
CREATE INDEX idx_posts_categories_category ON posts_categories(category_id);
```

### Database Relationships

```mermaid
graph LR
    subgraph "One-to-Many"
        User -->|creates| Posts
        User -->|creates| Pages
        Form -->|receives| Submissions
        Media -->|has| Sizes
    end
    
    subgraph "Many-to-Many"
        Posts <-->|relates_to| Posts
        Posts <-->|belongs_to| Categories
        Posts <-->|authored_by| Users
    end
    
    subgraph "One-to-One"
        Post -->|features| HeroImage
        Page -->|has| Meta
    end
    
    subgraph "Polymorphic"
        Versions -->|belongs_to| Content
        Media -->|attached_to| Any
    end
```

## API Architecture

### API Layer Structure

```mermaid
sequenceDiagram
    participant Client
    participant NextJS
    participant APIRoute
    participant Middleware
    participant PayloadAPI
    participant Database
    
    Client->>NextJS: HTTP Request
    NextJS->>APIRoute: Route Handler
    APIRoute->>Middleware: Process Request
    
    Note over Middleware: Authentication<br/>Rate Limiting<br/>CORS<br/>Validation
    
    Middleware->>PayloadAPI: Authorized Request
    
    alt Local API
        PayloadAPI->>Database: Direct Query
    else REST API
        PayloadAPI->>PayloadAPI: REST Handler
        PayloadAPI->>Database: Query via ORM
    else GraphQL API
        PayloadAPI->>PayloadAPI: GraphQL Resolver
        PayloadAPI->>Database: Query via ORM
    end
    
    Database-->>PayloadAPI: Data
    PayloadAPI-->>APIRoute: Response
    APIRoute-->>NextJS: HTTP Response
    NextJS-->>Client: JSON/HTML
```

### REST API Endpoints

```yaml
# Collections
GET     /api/{collection}              # List with pagination
GET     /api/{collection}/:id          # Get single document
POST    /api/{collection}              # Create document
PATCH   /api/{collection}/:id          # Update document
DELETE  /api/{collection}/:id          # Delete document

# Globals
GET     /api/globals/{global}          # Get global
POST    /api/globals/{global}          # Update global

# Auth
POST    /api/users/login               # Login
POST    /api/users/logout              # Logout
POST    /api/users/refresh-token       # Refresh JWT
POST    /api/users/forgot-password     # Request reset
POST    /api/users/reset-password      # Reset password

# Media
POST    /api/media                     # Upload file
GET     /api/media/:id/download        # Download file

# Special
GET     /api/{collection}/:id/versions # Get versions
POST    /api/{collection}/:id/publish  # Publish draft
GET     /api/access                    # Get user permissions
```

### GraphQL Schema

```graphql
type Query {
  # Collections
  Posts(
    where: Post_where
    limit: Int
    page: Int
    sort: String
    draft: Boolean
  ): Posts
  
  Post(
    id: String!
    draft: Boolean
  ): Post
  
  # Globals
  Header: Header
  Footer: Footer
  
  # Access
  Access: Access
}

type Mutation {
  # Create
  createPost(
    data: mutationPostInput!
    draft: Boolean
  ): Post
  
  # Update
  updatePost(
    id: String!
    data: mutationPostUpdateInput!
    draft: Boolean
    autosave: Boolean
  ): Post
  
  # Delete
  deletePost(id: String!): Post
  
  # Auth
  loginUser(
    email: String!
    password: String!
  ): usersLoginResult
  
  logoutUser: String
  
  # Media
  createMedia(
    data: mutationMediaInput!
    file: Upload!
  ): Media
}

# Types
type Post {
  id: String!
  title: String!
  slug: String!
  content: JSON
  heroImage: Media
  categories(limit: Int): [Category]
  authors(limit: Int): [User]
  status: Post_status
  publishedAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}

enum Post_status {
  draft
  published
}
```

## Data Flow Patterns

### Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Request
    Request --> RateLimit
    
    state RateLimit {
        [*] --> CheckLimit
        CheckLimit --> Allowed
        CheckLimit --> Rejected
    }
    
    Allowed --> Authentication
    Rejected --> [*]
    
    state Authentication {
        [*] --> VerifyToken
        VerifyToken --> Authenticated
        VerifyToken --> Anonymous
    }
    
    Authenticated --> Authorization
    Anonymous --> Authorization
    
    state Authorization {
        [*] --> CheckAccess
        CheckAccess --> Permitted
        CheckAccess --> Denied
    }
    
    Permitted --> Validation
    Denied --> [*]
    
    state Validation {
        [*] --> ValidateData
        ValidateData --> Valid
        ValidateData --> Invalid
    }
    
    Valid --> Operation
    Invalid --> [*]
    
    state Operation {
        [*] --> BeforeHooks
        BeforeHooks --> Execute
        Execute --> AfterHooks
        AfterHooks --> Response
    }
    
    Response --> [*]
```

### Hook Execution Flow

```mermaid
graph TD
    subgraph "Collection Hooks"
        BC[beforeChange]
        BV[beforeValidate]
        AC[afterChange]
        BR[beforeRead]
        AR[afterRead]
        BD[beforeDelete]
        AD[afterDelete]
    end
    
    subgraph "Field Hooks"
        FBC[Field beforeChange]
        FAC[Field afterChange]
        FBR[Field beforeRead]
        FAR[Field afterRead]
    end
    
    subgraph "Global Hooks"
        AO[afterOperation]
        AE[afterError]
    end
    
    Start --> BV
    BV --> FBC
    FBC --> BC
    BC --> Execute
    Execute --> AC
    AC --> FAC
    FAC --> AO
    
    Read --> BR
    BR --> FBR
    FBR --> ReadOp
    ReadOp --> FAR
    FAR --> AR
    
    Delete --> BD
    BD --> DeleteOp
    DeleteOp --> AD
    
    Error --> AE
```

### Transaction Management

```mermaid
sequenceDiagram
    participant API
    participant PayloadORM
    participant Drizzle
    participant PostgreSQL
    
    API->>PayloadORM: Start Operation
    PayloadORM->>Drizzle: Begin Transaction
    Drizzle->>PostgreSQL: BEGIN
    
    loop Database Operations
        PayloadORM->>Drizzle: Query 1
        Drizzle->>PostgreSQL: SQL
        PostgreSQL-->>Drizzle: Result
        
        PayloadORM->>Drizzle: Query 2
        Drizzle->>PostgreSQL: SQL
        PostgreSQL-->>Drizzle: Result
    end
    
    alt All Successful
        PayloadORM->>Drizzle: Commit
        Drizzle->>PostgreSQL: COMMIT
        PostgreSQL-->>API: Success
    else Error Occurred
        PayloadORM->>Drizzle: Rollback
        Drizzle->>PostgreSQL: ROLLBACK
        PostgreSQL-->>API: Rolled Back
    end
```

## Security Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant JWT
    participant Database
    
    User->>Frontend: Enter credentials
    Frontend->>API: POST /api/users/login
    API->>Database: Verify credentials
    
    alt Valid Credentials
        Database-->>API: User found
        API->>API: Hash comparison
        API->>JWT: Generate tokens
        JWT-->>API: Access + Refresh tokens
        API->>Database: Create session
        API-->>Frontend: 200 + Tokens
        Frontend->>Frontend: Store tokens
    else Invalid Credentials
        Database-->>API: Not found/mismatch
        API->>Database: Increment attempts
        API-->>Frontend: 401 Unauthorized
    end
    
    Note over Frontend: Subsequent Requests
    
    Frontend->>API: Request + Bearer token
    API->>JWT: Verify token
    
    alt Valid Token
        JWT-->>API: Decoded payload
        API->>Database: Get user
        Database-->>API: User data
        API-->>Frontend: 200 + Response
    else Expired Token
        Frontend->>API: Refresh token
        API->>JWT: Verify refresh
        JWT-->>API: New access token
        API-->>Frontend: New token
    end
```

### Access Control Matrix

```mermaid
graph TD
    subgraph "Roles"
        Admin[Admin Role]
        Editor[Editor Role]
        User[User Role]
        Public[Anonymous]
    end
    
    subgraph "Resources"
        Posts[Posts]
        Pages[Pages]
        Media[Media]
        Users[Users]
        Forms[Forms]
    end
    
    subgraph "Operations"
        Create[Create]
        Read[Read]
        Update[Update]
        Delete[Delete]
        Publish[Publish]
    end
    
    Admin -->|All Operations| Posts
    Admin -->|All Operations| Pages
    Admin -->|All Operations| Media
    Admin -->|All Operations| Users
    Admin -->|All Operations| Forms
    
    Editor -->|Create, Read, Update| Posts
    Editor -->|Read| Pages
    Editor -->|Create, Read| Media
    Editor -->|Read Own| Users
    
    User -->|Read Published| Posts
    User -->|Read Published| Pages
    User -->|Read| Media
    
    Public -->|Read Published| Posts
    Public -->|Read Published| Pages
    Public -->|Submit| Forms
```

### Field-Level Security

```typescript
// Field access control example
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin'
    }
  }
}
```

## Performance & Scaling

### Query Optimization

```mermaid
graph TD
    subgraph "Query Strategies"
        Select[Selective Queries]
        Populate[Smart Population]
        Index[Database Indexing]
        Cache[Query Caching]
    end
    
    subgraph "Optimization Techniques"
        Select --> Projection[Field Projection]
        Populate --> Depth[Depth Limiting]
        Index --> Composite[Composite Indexes]
        Cache --> TTL[TTL Management]
    end
    
    subgraph "Results"
        Projection --> Reduced[Reduced Payload]
        Depth --> Faster[Faster Queries]
        Composite --> Quick[Quick Lookups]
        TTL --> Fresh[Fresh Data]
    end
```

### Caching Strategy

```mermaid
sequenceDiagram
    participant Client
    participant Cache
    participant API
    participant Database
    
    Client->>Cache: Request data
    
    alt Cache Hit
        Cache-->>Client: Return cached data
    else Cache Miss
        Cache->>API: Forward request
        API->>Database: Query data
        Database-->>API: Return data
        API->>Cache: Store in cache
        Cache-->>Client: Return data
    end
    
    Note over Cache: TTL expires
    
    Cache->>Cache: Invalidate entry
    
    Note over API: Data updated
    
    API->>Cache: Invalidate related
    Cache->>Cache: Clear entries
```

### Database Connection Pooling

```mermaid
graph TD
    subgraph "Connection Pool"
        Pool[Connection Pool Manager]
        C1[Connection 1]
        C2[Connection 2]
        C3[Connection 3]
        CN[Connection N]
    end
    
    subgraph "Request Handlers"
        R1[Request 1]
        R2[Request 2]
        R3[Request 3]
        RN[Request N]
    end
    
    subgraph "Database"
        DB[(PostgreSQL)]
    end
    
    R1 -->|Acquire| Pool
    Pool -->|Assign| C1
    C1 -->|Query| DB
    DB -->|Result| C1
    C1 -->|Release| Pool
    
    R2 -->|Acquire| Pool
    Pool -->|Assign| C2
    
    Pool -->|Manage| C1
    Pool -->|Manage| C2
    Pool -->|Manage| C3
    Pool -->|Manage| CN
```

### Scaling Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Vercel Edge Network]
    end
    
    subgraph "Application Instances"
        App1[Serverless Function 1]
        App2[Serverless Function 2]
        AppN[Serverless Function N]
    end
    
    subgraph "Database Cluster"
        Primary[(Primary DB)]
        Read1[(Read Replica 1)]
        Read2[(Read Replica 2)]
    end
    
    subgraph "Cache Layer"
        Redis1[Redis Node 1]
        Redis2[Redis Node 2]
    end
    
    subgraph "Storage"
        S3[Object Storage]
        CDN[CDN]
    end
    
    LB --> App1
    LB --> App2
    LB --> AppN
    
    App1 --> Primary
    App2 --> Read1
    AppN --> Read2
    
    App1 --> Redis1
    App2 --> Redis2
    
    App1 --> S3
    S3 --> CDN
```

## Migration System

### Migration Workflow

```mermaid
stateDiagram-v2
    [*] --> Development
    
    state Development {
        [*] --> SchemaChange
        SchemaChange --> DrizzlePush
        DrizzlePush --> TestLocally
    }
    
    TestLocally --> CreateMigration
    
    state CreateMigration {
        [*] --> GenerateSQL
        GenerateSQL --> ReviewChanges
        ReviewChanges --> CommitMigration
    }
    
    CommitMigration --> Staging
    
    state Staging {
        [*] --> RunMigrations
        RunMigrations --> ValidateSchema
        ValidateSchema --> TestFeatures
    }
    
    TestFeatures --> Production
    
    state Production {
        [*] --> BackupDatabase
        BackupDatabase --> RunMigrations
        RunMigrations --> VerifyData
        VerifyData --> [*]
    }
```

## Summary

The backend and database architecture provides:

1. **Flexibility**: Database adapter pattern for multiple database support
2. **Security**: Multi-layered security with granular access control
3. **Performance**: Connection pooling, query optimization, and caching
4. **Reliability**: Transaction support and automatic rollbacks
5. **Scalability**: Horizontal scaling with read replicas and caching
6. **Maintainability**: Clear separation of concerns and migration system

Key architectural decisions:
- **PostgreSQL with Drizzle**: Type-safe queries with excellent performance
- **Adapter Pattern**: Easy to switch databases if needed
- **Hook System**: Extensible business logic without modifying core
- **API Options**: Local, REST, and GraphQL for different use cases
- **Serverless Ready**: Optimized for edge deployment

This architecture ensures the application can handle complex content management requirements while maintaining performance and developer experience.
