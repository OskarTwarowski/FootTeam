FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/FootTeam.Api/FootTeam.Api.csproj backend/FootTeam.Api/
COPY backend/FootTeam.Application/*.csproj backend/FootTeam.Application/
COPY backend/FootTeam.Domain/*.csproj backend/FootTeam.Domain/
COPY backend/FootTeam.Infrastructure/*.csproj backend/FootTeam.Infrastructure/

RUN dotnet restore backend/FootTeam.Api/FootTeam.Api.csproj

COPY backend/ .
RUN dotnet publish FootTeam.Api/FootTeam.Api.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FootTeam.Api.dll"]
