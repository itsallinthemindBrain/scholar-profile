// ============================================================
// Module: Resource Group
// ============================================================
targetScope = 'subscription'

@description('Name of the resource group.')
param name string

@description('Azure region for the resource group.')
param location string

@description('Resource tags.')
param tags object

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: name
  location: location
  tags: tags
}

@description('The name of the provisioned resource group.')
output resourceGroupName string = rg.name
