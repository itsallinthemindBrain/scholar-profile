// ============================================================
// Scholar Profile — Infrastructure Entry Point
// Scope: Subscription (creates resource group + Static Web App)
// ============================================================
targetScope = 'subscription'

@description('Project name used in all resource names.')
param projectName string = 'scholar-profile'

@description('Deployment environment (e.g. prod, staging).')
param environment string = 'prod'

@description('Azure region for all resources. Southeast Asia (Singapore) is closest to the Philippines.')
param location string = 'eastasia'

@description('Full URL of the GitHub repository (e.g. https://github.com/your-username/your-repo).')
param repositoryUrl string = 'https://github.com/itsallinthemindBrain/scholar-profile'

@description('GitHub branch to deploy from.')
param branch string = 'main'

@description('Path to the frontend app folder within the repository.')
param appLocation string = 'frontend'

@description('GitHub personal access token used by Azure to connect to the repository. Marked secure — never logged or exposed.')
@secure()
param repositoryToken string

// ============================================================
// VARIABLES
// ============================================================
var rgName  = '${projectName}-rg-${environment}'
var swaName = '${projectName}-swa-${environment}'
var tags = {
  project: projectName
  environment: environment
  managedBy: 'bicep'
}

// ============================================================
// MODULE: Resource Group
// ============================================================
module rg 'modules/resourceGroup.bicep' = {
  name: 'deploy-rg'
  params: {
    name: rgName
    location: location
    tags: tags
  }
}

// ============================================================
// MODULE: Azure Static Web App
// ============================================================
module swa 'modules/staticWebApp.bicep' = {
  name: 'deploy-swa'
  scope: resourceGroup(rgName)
  dependsOn: [rg]
  params: {
    name: swaName
    location: location
    repositoryUrl: repositoryUrl
    branch: branch
    appLocation: appLocation
    repositoryToken: repositoryToken
    tags: tags
  }
}

// ============================================================
// OUTPUTS
// ============================================================
@description('The default hostname assigned to the Static Web App.')
output staticWebAppHostname string = swa.outputs.defaultHostname
