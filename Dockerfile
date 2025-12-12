# ===========================
# Base runtime image
# ===========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

# ===========================
# Build stage
# ===========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all .csproj files first (this allows proper restore)
COPY backend/FootTeam.Api/FootTeam.Api.csproj backend/FootTeam.Api/
COPY backend/FootTeam.Application/FootTeam.Application.csproj backend/FootTeam.Application/
COPY backend/FootTeam.Infrastructure/FootTeam.Infrastructure.csproj backend/FootTeam.Infrastructure/
COPY backend/FootTeam.Domain/FootTeam.Domain.csproj backend/FootTeam.Domain/

# Restore dependencies
RUN dotnet restore backend/FootTeam.Api/FootTeam.Api.csproj

# Copy the rest of the code
COPY backend/ ./backend/

# Publish API project
RUN dotnet publish backend/FootTeam.Api/FootTeam.Api.csproj -c Release -o /app/publish

# ===========================
# Final image
# ===========================
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FootTeam.Api.dll"]
