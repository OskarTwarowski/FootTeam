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

# Copy everything
COPY . .

# Restore + build + publish
RUN dotnet restore FootTeam.Api.csproj
RUN dotnet publish FootTeam.Api.csproj -c Release -o /app/publish

# ===========================
# Final stage
# ===========================
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "FootTeam.Api.dll"]
