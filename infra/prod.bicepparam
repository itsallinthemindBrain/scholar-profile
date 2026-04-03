// ============================================================
// Production parameters — Scholar Profile
// WARNING: Never commit real tokens to this file.
//          Pass repositoryToken securely at deploy time:
//
//   az deployment sub create \
//     --location southeastasia \
//     --template-file infra/main.bicep \
//     --parameters infra/prod.bicepparam \
//                  repositoryToken=$GITHUB_TOKEN
// ============================================================
using './main.bicep'

param projectName   = 'scholar-profile'
param environment   = 'prod'
param location      = 'southeastasia'
param repositoryUrl = 'https://github.com/itsallinthemindBrain/scholar-profile'
param branch        = 'main'
param appLocation   = 'frontend'

// repositoryToken placeholder — override at deploy time as shown above. Never set a real token here.
param repositoryToken = ''
