📋 Prerequisites
Docker installed [Download Docker](https://www.docker.com/get-started)

Docker Compose (usually included with Docker Desktop)

🚀 Quick Start
Clone the repository:

bash
git clone https://github.com/guilhermeytalo/sqlknow.git
cd dictionary-backend

Generate the JWT secret key for .env.prod:
```bash
# Linux/macOS:
openssl rand -base64 32

# Windows (PowerShell):
[System.Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 255) }))
```

Start the containers:
```bash
docker-compose up -d

# This will launch:

PostgreSQL database (dictionary-postgres)
Dictionary API (dictionary-api)

# Verify services are running:

docker ps
# Expected output:

CONTAINER ID   IMAGE             ...   PORTS                    NAMES
abc123        dictionary-api    ...   0.0.0.0:8080->8080/tcp   dictionary-api
xyz456        postgres:16       ...   0.0.0.0:5433->5432/tcp   dictionary-postgres
```

# 🔧 Connection Details

## 🌐 API Endpoints
Local access: http://localhost:8080
Swagger UI (if enabled): http://localhost:8080/swagger

## 🐘 PostgreSQL Access
Parameter	Value
Host	localhost
Port	5433 (external)
Database	dictionarydb
Username	postgres
Password	postgres
Internal Port	5432 (container-to-container)

# 🛠️ Common Commands

## 🐳 Docker Management
```bash 
#Command	Description
docker-compose up -d	Start services in background
docker-compose down	Stop and remove containers
docker-compose logs -f	View live logs
docker exec -it dictionary-postgres psql -U postgres	Access DB shell
```

## 🔄 Database Operations
```bash
# Backup database
docker exec dictionary-postgres pg_dump -U postgres dictionarydb > backup.sql

# Restore database
cat backup.sql | docker exec -i dictionary-postgres psql -U postgres dictionarydb

🚨 Troubleshooting
❌ "User does not exist" Error
Recreate the user in Docker:

docker exec -it dictionary-postgres psql -U postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';"
```

# 🔌 Connection Issues
From host machine: Use localhost:5432

Between containers: Use db:5433

# 🧹 Reset Everything
```bash
docker-compose down -v  # Removes containers AND volumes
docker-compose up -d    # Fresh start
```

📂 File Structure
```
dictionary-backend/
├── Dictionary.API/
│ ├── Controllers/
│ │ ├── AuthController.cs
│ │ ├── DictionaryController.cs
│ │ ├── ReactController.cs
│ │ └── UserController.cs
│ ├── DTOs/
│ │ ├── DictionaryEntryDto.cs
│ │ ├── DictionaryResponseDto.cs
│ │ ├── DictionarySearchResponseDto.cs
│ │ ├── LoginDto.cs
│ │ ├── RegisterDto.cs
│ │ └── WordDto.cs
│ ├── Interfaces/
│ │ ├── IAuthService.cs
│ │ └── IDictionaryService.cs
│ ├── Properties/
│ │ └── launchSettings.json
│ ├── Services/
│ │ ├── AuthService.cs
│ │ └── DictionaryService.cs
│ ├── appsettings.json
│ ├── appsettings.Development.json
│ ├── Dockerfile
│ ├── Program.cs
│ └── Dictionary.API.csproj
│
├── Dictionary.Domain/
│ ├── Entities/
│ │ ├── Favorite.cs
│ │ ├── User.cs
│ │ ├── Word.cs
│ │ └── WordHistory.cs
│ └── Dictionary.Domain.csproj
│
├── Dictionary.Infrastructure/
│ ├── Migrations/
│ │ ├── 202405161218563_InitialCreate.cs
│ │ ├── 202405161218563_InitialCreate.Designer.cs
│ │ ├── 20240517001117_AddFavoriteTable.cs
│ │ ├── 20240517001117_AddFavoriteTable.Designer.cs
│ │ └── AppDbContextModelSnapshot.cs
│ ├── Persistence/
│ │ ├── AppDbContext.cs
│ │ ├── DbInitializer.cs
│ │ └── DesignTimeDbContextFactory.cs
│ └── Dictionary.Infrastructure.csproj
│
├── Dictionary.Tests/
│ └── Dictionary.Tests.csproj
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── global.json
└── README.md
```