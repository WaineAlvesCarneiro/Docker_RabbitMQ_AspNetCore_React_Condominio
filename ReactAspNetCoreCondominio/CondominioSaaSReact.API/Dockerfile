FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8081

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["CondominioSaaSReact.API/CondominioSaaSReact.API.csproj", "CondominioSaaSReact.API/"]
COPY ["CondominioSaaSReact.Application/CondominioSaaSReact.Application.csproj", "CondominioSaaSReact.Application/"]
COPY ["CondominioSaaSReact.Domain/CondominioSaaSReact.Domain.csproj", "CondominioSaaSReact.Domain/"]
COPY ["CondominioSaaSReact.Configurations/CondominioSaaSReact.Configurations.csproj", "CondominioSaaSReact.Configurations/"]
COPY ["CondominioSaaSReact.Infrastructure/CondominioSaaSReact.Infrastructure.csproj", "CondominioSaaSReact.Infrastructure/"]

RUN dotnet restore "./CondominioSaaSReact.API/CondominioSaaSReact.API.csproj"
COPY . .
WORKDIR "/src/CondominioSaaSReact.API"
RUN dotnet build "./CondominioSaaSReact.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CondominioSaaSReact.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:8081

ENTRYPOINT ["dotnet", "CondominioSaaSReact.API.dll"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8081/health || exit 1