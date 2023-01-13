python create_dataset.py "D://repos//Quake//common" "D://repos//Quake//QuakeGL" "D://repos//Quake//QuakeHW"

$file = "index.html"

# Check if the file is already open
$process = Get-Process | Where-Object {$_.MainWindowTitle -like "*$file*"}

# If the file is already open, activate the window and refresh the page
if ($process) {
    $process.MainWindowHandle
    $process.Refresh()
}
else {
    # If the file is not open, open it in the default web browser
    Start-Process $file
}