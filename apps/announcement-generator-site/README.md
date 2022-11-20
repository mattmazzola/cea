# CEA SC2 Announcement Generator

## Build Image

```
docker build -t cea-announcement .
```

## Run container Locally

```
docker run --rm -it `
    -p 8080:8080 `
    -e MAPS_URL="https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json" `
    -e BASE_URL="https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod" `
    -e TEAM_NAME="Macrohard Microsoft" `
    -e MATCH_TIME="Saturday 11am PDT (UTC-7)" `
    cea-announcement
```

## Log in to Azure

```
az login
az account set -s 375b0f6d-8ad5-412d-9e11-15d36d14dc63
az account show --query name
```

## Push image to ACR

```
$acrName = 'mattmazzolaacr'
$repositoryName = 'cea'
$imageName = 'apps-announcement'
$imageVersion = '0.1.0'
$fullImageName = "${repositoryName}/${imageName}:${imageVersion}"

az acr build -r $acrName --image $fullImageName .
```

## Get image URL

```
$acrUrl = $(az acr show -n $acrName --query loginServer)
$acrImageName = "$($acrUrl)/$($fullImageName)"
```

## ACR password

```
$acrUsername = $(az acr credential show -n $acrName --query "username" -o tsv)
$acrPassword = $(az acr credential show -n $acrName --query "passwords[0].value" -o tsv)
```

## ACR Login

```
az acr login -n $acrName -u $acrUsername -p $acrPassword
```

## Run Image From ACR

```
docker run --rm -it `
    -p 8080:8080 `
    -e MAPS_URL="https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json" `
    -e BASE_URL="https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod" `
    -e TEAM_NAME="Macrohard Microsoft" `
    -e MATCH_TIME="Saturday 11am PDT (UTC-7)" `
    $acrImageName
```

## Create Container App From Image
