function Download-File-With-Progress {
    param(
        [string]$url,
        [string]$output
    )
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, "./tools/$output")
    Write-Host "Downloaded $output`n" -ForegroundColor Green
}

$tools = @(
    @{
        name = "ndk";
        url = "https://dl.google.com/android/repository/android-ndk-r26d-linux.zip";
        output = "android-ndk-r26d-linux.zip";
    },
    @{
        name = "java 17";
        url = "https://builds.openlogic.com/downloadJDK/openlogic-openjdk/17.0.14+7/openlogic-openjdk-17.0.14+7-linux-x64.tar.gz";
        output = "openlogic-openjdk-17.0.14+7-linux-x64.tar.gz";
    },
    @{
        name = "Android Command Line Tools";
        url = "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip?hl=pt-br";
        output = "commandlinetools-linux-11076708_latest.zip";
    }   
)

Write-Host "Downloading tools..." -ForegroundColor Yellow
foreach ($tool in $tools) {
    Write-Host "Downloading $($tool.name)..."
    Download-File-With-Progress $tool.url $tool.output
}

Write-Host "Downloading tools finished." -ForegroundColor Blue
