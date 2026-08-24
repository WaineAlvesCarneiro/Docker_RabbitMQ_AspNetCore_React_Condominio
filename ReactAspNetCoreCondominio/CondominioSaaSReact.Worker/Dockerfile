FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
USER $APP_UID
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CondominioSaaSReact.Worker/CondominioSaaSReact.Worker.csproj", "CondominioSaaSReact.Worker/"]
COPY ["CondominioSaaSReact.Domain/CondominioSaaSReact.Domain.csproj", "CondominioSaaSReact.Domain/"]
COPY ["CondominioSaaSReact.Infrastructure/CondominioSaaSReact.Infrastructure.csproj", "CondominioSaaSReact.Infrastructure/"]
COPY ["CondominioSaaSReact.Application/CondominioSaaSReact.Application.csproj", "CondominioSaaSReact.Application/"]
RUN dotnet restore "./CondominioSaaSReact.Worker/CondominioSaaSReact.Worker.csproj"
COPY . .
WORKDIR "/src/CondominioSaaSReact.Worker"
RUN dotnet build "./CondominioSaaSReact.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CondominioSaaSReact.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CondominioSaaSReact.Worker.dll"]