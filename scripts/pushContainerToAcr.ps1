$acrName = 'mattmazzolaacr'
$repositoryName = 'cea'
$imageName = 'apps-announcement'
$imageVersion = '0.1.2'
$MAPS_URL = 'https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json'
$BASE_URL = 'https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod'
$TEAM_NAME = 'Macrohard Microsoft'
$MATCH_TIME = 'Saturday 11am PDT (UTC-7)'

$fullImageName = "${repositoryName}/${imageName}:${imageVersion}"

$acrUrl = $(az acr show -n $acrName --query loginServer)
$acrUsername = $(az acr credential show -n $acrName --query "username" -o tsv)
$acrPassword = $(az acr credential show -n $acrName --query "passwords[0].value" -o tsv)

az acr login -n $acrName -u $acrUsername -p $acrPassword

Write-Output $fullImageName

az acr build -r $acrName --image $fullImageName "$PSScriptRoot\..\apps\announcement-generator-site"

$acrImageName = "$($acrUrl)/$($fullImageName)"

$data = [ordered]@{
    acrImageName = $acrImageName;
    MAPS_URL     = $MAPS_URL;
    BASE_URL     = $BASE_URL;
    TEAM_NAME    = $TEAM_NAME;
    MATCH_TIME   = $MATCH_TIME;
}

echo "Container Vars"
echo $data

docker run --rm -it `
    -p 8080:8080 `
    -e MAPS_URL=$MAPS_URL `
    -e BASE_URL=$BASE_URL `
    -e TEAM_NAME=$TEAM_NAME `
    -e MATCH_TIME=$MATCH_TIME `
    $acrImageName