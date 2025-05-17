FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy all project files first
COPY ["Dictionary.API/Dictionary.API.csproj", "Dictionary.API/"]
COPY ["Dictionary.Application/Dictionary.Application.csproj", "Dictionary.Application/"]
COPY ["Dictionary.Domain/Dictionary.Domain.csproj", "Dictionary.Domain/"]
COPY ["Dictionary.Infrastructure/Dictionary.Infrastructure.csproj", "Dictionary.Infrastructure/"]

# Restore all projects
RUN dotnet restore "Dictionary.API/Dictionary.API.csproj"

COPY . .
WORKDIR "/src/Dictionary.API"
RUN dotnet build "./Dictionary.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Dictionary.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Dictionary.API.dll"]