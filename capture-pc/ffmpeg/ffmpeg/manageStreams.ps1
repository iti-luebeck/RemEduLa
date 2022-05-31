clear
cd C:\ffmpeg
#taskmgr
#------------------------------------------------
#-hide_banner -loglevel error
#-thread_queue_size 2048
$process0 = @{
    FilePath = ".\bin\ffmpeg.exe"
    ArgumentList = Get-Content ".\processes\process0.txt"
#    RedirectStandardInput = ""
    RedirectStandardOutput = ".\processes\msg\process0-out.txt"
#    RedirectStandardError = ".\processes\msg\process0-error.txt"#".\NUL"
    UseNewEnvironment = $false
}
$process1 = @{
    FilePath = ".\bin\ffmpeg.exe"
    ArgumentList = Get-Content ".\processes\process1.txt"
#    RedirectStandardInput = ""
    RedirectStandardOutput = ".\processes\msg\process1-out.txt"
#    RedirectStandardError = ".\processes\msg\process1-error.txt"#".\NUL"
    UseNewEnvironment = $false
}
$process2 = @{
    FilePath = ".\bin\ffmpeg.exe"
    ArgumentList = Get-Content ".\processes\process2.txt"
#    RedirectStandardInput = ""
    RedirectStandardOutput = ".\processes\msg\process2-out.txt"
#    RedirectStandardError = ".\processes\msg\process2-error.txt"#".\NUL"
    UseNewEnvironment = $false
}

$processes=@($process0,$process1)
$timers=@()
$tasks = @()
$crashCnt = @()

#------------------------------------------------

[System.Diagnostics.Process[]]$processList = Get-Process "ffmpeg" -ErrorAction SilentlyContinue
 ForEach ($process in $processList) {
    Stop-Process -Id $process.Id -Force -Verbose
}

#------------------------------------------------

for($i=0; $i -lt $processes.length; $i++){
    $processes[$i].ArgumentList=([String] ($processes[$i].ArgumentList)).Replace("`n","").Replace("`r","").Split(" ").Replace("♥"," ")
    $processes[$i].ArgumentList=$processes[$i].ArgumentList.Where({ $_ -ne "" })
    $processOptions = $processes[$i];
    $tmpProcess = Start-Process @processOptions -passthru -ErrorAction SilentlyContinue    
    $tasks=$tasks + $tmpProcess.Id
    $crashCnt=$crashCnt + 0
    $timers=$timers + [System.Diagnostics.Stopwatch]::StartNew()
    #Start-Sleep -s 1
    #Get-Content $processOptions.RedirectStandardError
    #echo $processOptions.ArgumentList
    #exit
}

#------------------------------------------------

while($true) {
    $processRunning=$false
    for ($i=0; $i -lt $tasks.length; $i++){
        if($tasks[$i] -gt 0){
            #process should be running    
            $processRunning=$true         
            $tmpProcess = Get-Process -ID $tasks[$i] -ErrorAction SilentlyContinue
            If ($tmpProcess){
                #process actualy running
                if($tasks[$i] -gt 0){
                    if($timers[$i].Elapsed.TotalMinutes -ge 15){
                        $crashCnt[$i]=0
                    }
                }
            }else{          
                #process not running
                if($crashCnt[$i] -gt 4){
                    #echo "entferne Prozess aus restart und schreibe Mail"
                    $tasks[$i]=0
                    $timers[$i].Stop()
                }else{                                
                    $processOptions = $processes[$i];
                    echo (Get-Content $processOptions.RedirectStandardError)
                    $tmpProcess = Start-Process @processOptions -passthru -ErrorAction SilentlyContinue
                    $tasks[$i] = $tmpProcess.Id
                    echo ("Process crashed after: "+$timers[$i].Elapsed.TotalMilliseconds.ToString()+"ms")
                    $timers[$i].Stop()
                    $crashCnt[$i]=$crashCnt[$i]+1
                    $timers[$i]=[System.Diagnostics.Stopwatch]::StartNew()               
                }
            }
        }
    }
    if(!$processRunning){
        echo "all processes crashed... exiting"
        exit
    }
}