// ============================================================
// Module: Azure Static Web App (Free tier)
// ============================================================

@description('Name of the Static Web App resource.')
param name string

@description('Azure region for deployment.')
param location string

@description('Full URL of the GitHub repository.')
param repositoryUrl string

@description('GitHub branch to deploy from.')
param branch string

@description('Path to the frontend app folder within the repository.')
param appLocation string

@description('GitHub personal access token used by Azure to connect to the repository. Marked secure — never logged or exposed.')
@secure()
param repositoryToken string

@description('Resource tags.')
param tags object

resource swa 'Microsoft.Web/staticSites@2023-01-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    repositoryToken: repositoryToken
    buildProperties: {
      appLocation: appLocation
      apiLocation: ''
      outputLocation: ''
    }
  }
}

@description('The default hostname assigned to the Static Web App.')
output defaultHostname string = swa.properties.defaultHostname
