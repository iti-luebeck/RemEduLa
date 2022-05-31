#!/bin/bash
ServerIP="Videoserver"
SSHUser="Streamer"
NGINXIP=$(ifconfig ens160 | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')

#clean everything
	#clear
	#rm -rf /media/ramdisk/log
#start Videoserver-PC
	sudo etherwake -i ens160 18:C0:4D:34:2B:82
	echo "waiting for Videoserver to boot..."
	while ! timeout 0.2 ping -c 1 -n -w 1 $ServerIP > /dev/null
	do
	    printf "%c" "."
	done
	echo "done"
#start monitoring software		
	#<< 'MULTILINE-COMMENT'
	sudo pkill -f "tcptrack"
	sudo pkill -f "htop"
	gnome-terminal --tab --title=tcptrack -- bash -c "sudo tcptrack -i ens160 ;bash"
	gnome-terminal --tab --title=htop -- bash -c "htop ;bash"
	#MULTILINE-COMMENT
#kill tasks on Videoserver-PC	
	#ssh $SSHUser@$ServerIP 'Get-Process "sshd" -ErrorAction SilentlyContinue | Stop-Process; exit'
	#ssh $SSHUser@$ServerIP 'Get-Process "conhost" -ErrorAction SilentlyContinue | Stop-Process; exit'
	ssh $SSHUser@$ServerIP 'Get-Process "ffmpeg" -ErrorAction SilentlyContinue | Stop-Process; exit'
#restart Nginx	
	mkdir -p /media/ramdisk/log
	sudo chmod -R 777  /media/ramdisk/log
	nginx -s stop
	sudo fuser -k 80/tcp
	sudo fuser -k 8000/tcp
	sudo fuser -k 443/tcp
	#sudo fuser -k 81/tcp
	#sudo fuser -k 8001/tcp
	#sudo fuser -k 444/tcp
	nginx
#prepare process directorys
	rm -rf /media/ramdisk/proc
	mkdir -p /media/ramdisk/proc

generateAudioDeviceList(){
	# https://winaero.com/how-to-find-and-list-connected-usb-devices-in-windows-10/
	# https://stackoverflow.com/questions/17874882/getting-location-information-of-the-connected-usb-device
		
	#$Audiodevices = Get-PnpDevice -PresentOnly | Where-Object { $_.Class -match "^AudioEndpoint" } | Where-Object {$_.FriendlyName -match "USB Audio Device"} | Where-Object {$_.FriendlyName -match "Mikrofon"}
	#$USBdevices =  Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -match "^USB" } | Where-Object {$_.FriendlyName -match "USB Audio Device"}
	#$nameIDMap=@{}
	#foreach($aDev in $Audiodevices){
	#	$propAdev = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Enum\$($aDev.InstanceId)"
	#	$nameIDMap.add($propAdev.ContainerID,$propAdev.FriendlyName) 
	#}
	#$portNameMap=[ordered]@{}
	#foreach($uDev in $USBdevices ){
	#	$propUdev = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Enum\$($uDev.InstanceId)"
	#	$port = $propUdev.LocationInformation
	#	$port = $port.Substring(15,($port.Length-12)-15)
	#	$port=$port.split(".")
	#	$port = $port -replace "^0+(?=[^.])"
	#	$port = $port -join "."
	#	$portNameMap.add($port, $nameIDMap[$propUdev.ContainerID]) 		
	#}
	#$portNameMap = $portNameMap.GetEnumerator()|Sort Name -Descending
	#$outString=""
	#foreach($pair in $portNameMap.GetEnumerator() ){
	#	$outString="$($pair.Name)`n`r$($pair.Value)`n`r$outString"
	#}
	#echo $outString
	
	
	
	sshCmd='$Audiodevices = Get-PnpDevice -PresentOnly | Where-Object { $_.Class -match "^AudioEndpoint" } | Where-Object {$_.FriendlyName -match "USB Audio Device"} | Where-Object {$_.FriendlyName -match "Mikrofon"}; $USBdevices =  Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -match "^USB" } | Where-Object {$_.FriendlyName -match "USB Audio Device"}; $nameIDMap=@{}; foreach($aDev in $Audiodevices){ $propAdev = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Enum\$($aDev.InstanceId)"; $nameIDMap.add($propAdev.ContainerID,$propAdev.FriendlyName); }; $portNameMap=[ordered]@{}; foreach($uDev in $USBdevices ){ $propUdev = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Enum\$($uDev.InstanceId)"; $port = $propUdev.LocationInformation; $port = $port.Substring(15,($port.Length-12)-15); $port=$port.split("."); $port = $port -replace "^0+(?=[^.])"; $port = $port -join "."; $portNameMap.add($port, $nameIDMap[$propUdev.ContainerID]); }; $portNameMap = $portNameMap.GetEnumerator()|Sort Name -Descending; $outString=""; foreach($pair in $portNameMap.GetEnumerator() ){ $outString="$($pair.Name)`n$($pair.Value)`n$outString"; }; echo $outString; exit'	
	portNameMap=$(ssh $SSHUser@$ServerIP $sshCmd)
}

#Arguments
# $1 audio device lsit - "1.2.3.4\n Name"
# $2 reduce id - 4
# $3 modify generatedString - "false"
reduceAudioDeviceList(){
	audioDeviceList=""
	nextLineValid="false"
	isFirstLine="true"
	while IFS= read -r line; do
		tmp=$(sed '/^[[:space:]]*$/d' <<< "$line")
		if [[ $nextLineValid == "true" ]]; then
			if [[ $3 == "true" ]]; then
				generatedString="$generatedString -f dshow -i audio=\"$tmp\""
			fi
			nextLineValid="false"
			if [[ $isFirstLine == "true" ]]; then
				audioDeviceList=$(echo "$audioDeviceList$line")
				isFirstLine="false"
			else
				audioDeviceList=$(echo "$audioDeviceList\n$line")
			fi
		fi
		if [[ $tmp == ${2}* ]]; then
			nextLineValid="true"
			tmpLine="${line#*.}"
			if [[ $isFirstLine == "true" ]]; then
				audioDeviceList=$(echo "$audioDeviceList$tmpLine")
				isFirstLine="false"
			else
				audioDeviceList=$(echo "$audioDeviceList\n$tmpLine")
			fi
		else
			nextLineValid="false"
		fi
	done <<< "$1"
	audioDeviceList=$(echo -e "$audioDeviceList")
}

#Arguments
# $1 video device - "Cam Link Pro HDMI-2"
# $2 number split in x - 4
# $3 number split in y - 4
# $4 nginx IP - 141.83.158.36
# $5 stream ID - "ZedBoard"
# $6 USB-Root port audio - 3
generateFFMPEGString(){
	generateAudioDeviceList
	#generatedString="\$tmpProc = Start-Process -FilePath \"ffmpeg\" -ArgumentList '"
	generatedString="ffmpeg "
	generatedString="$generatedString-hide_banner -loglevel error -hwaccel cuvid -hwaccel_output_format cuda -y -an -f dshow -rtbufsize 1024M -pix_fmt bgr0 -i video=\"$1\" "
	#generatedString="$generatedString-report -hwaccel cuvid -hwaccel_output_format cuda -y -an -f dshow -rtbufsize 1024M -pix_fmt bgr0 -i video=\"$1\" "
	#generatedString="$generatedString -f dshow -i audio=\"Mikrofon (11- USB Audio Device)\""
	reduceAudioDeviceList "$portNameMap" "$6" "true"
	portNameMap=$audioDeviceList
	generatedString="$generatedString -filter_complex "
	generatedString="$generatedString \"[0:v]split=$(($2*$3))"
	y=0
	while [ "$y" -lt "$3" ]; do
		x=0
	    	while [ "$x" -lt "$2" ]; do
		    generatedString="$generatedString[s$y$x]"
		    x=$(( x + 1 ))
		done 
	    y=$(( y + 1 ))
	done 
	generatedString="$generatedString;"
	y=0
	while [ "$y" -lt "$3" ]; do
		x=0
	    	while [ "$x" -lt "$2" ]; do
		    generatedString="$generatedString [s$y$x]crop=in_w/$2:in_h/$3:(in_w/$2)*$x:(in_h/$3)*$y[v$y$x]"
		    x=$(( x + 1 ))
		    if [ $y -eq $(($3-1)) ] && [ $x -eq $2 ]; then
		    	generatedString="$generatedString\""
	    	    else
	    	    	generatedString="$generatedString;"
		    fi
		done 
	    y=$(( y + 1 ))
	done 
	y=0
	c=1
	while [ "$y" -lt "$3" ]; do
		x=0
		tmpList=$portNameMap
		reduceAudioDeviceList "$tmpList" "$((y + 1))" "false"
		tmpList=$audioDeviceList 
	    	while [ "$x" -lt "$2" ]; do
	    		tmpCmp="$((x + 1))"
	    		if [[ $tmpList == ${tmpCmp}* ]]; then
	    			generatedString="$generatedString -map $c:a -acodec aac -b:a 192k " #-vbr 3 -b:a 192k
	    			c=$(( c + 1 ))
	    			tmpList=$(sed -e '1,2d' <<< "$tmpList")
	    		fi			
			generatedString="$generatedString -map [v$y$x] -vcodec h264_nvenc -preset fast -r 30 -f mpegts http://$4:8000/publish/$5-Id$y$x"

			x=$(( x + 1 ))
		done 
	    y=$(( y + 1 ))
	done 
	#generatedString="$generatedString' -passthru -ErrorAction SilentlyContinue; echo \$tmpProc.id; exit"
	generatedString="$generatedString; exit"
}

#Arguments
# $1 process name - ffmpeg
getPIDListProcess(){
	tasklist=$(ssh $SSHUser@$ServerIP '$processList = Get-Process '"$1"' -ErrorAction SilentlyContinue; echo $processList.Id; exit')
}

#Arguments
# $1 process name - ffmpeg
# $2 process number - p0
startRemoteProcess(){
	getPIDListProcess $1
	pidListOld=$tasklist
	gnome-terminal --tab --title="$1 $2" -- bash -c "ssh $SSHUser@$ServerIP "'$(cat /media/ramdisk/proc/'"$2"'.cmd) &>> /media/ramdisk/log/'"$2"'_out.log ;exit ;bash'
	sleep 1.0
	getPIDListProcess $1
	tasklist=$(sed 's/\r$//' <<< "$tasklist")
	while IFS= read -r line; do
		tmp=$(sed 's/[^0-9]*//g' <<< "$line")
		#echo "TPS: $tmp TPE"
		#echo "Vor: $tasklist VE"
		tasklist=${tasklist//$tmp/}
		tasklist=$(sed '/^[[:space:]]*$/d' <<< "$tasklist")
		#tasklist=$(sed "/^$tmp/d" <<< "$tasklist")
		#echo "Nach: $tasklist NE"
	done <<< "$pidListOld"
	PID=$(sed 's/[^0-9]*//g' <<< "$tasklist")
	#echo "TLS: $PID TLE"
	
	#PID=$(ssh $SSHUser@$ServerIP $(cat "/media/ramdisk/proc/$2.cmd"))
	echo "$1 $2 started PID: $PID"
}

#Arguments
# $1 PID - 5324
checkRemoteProcessIsRunning(){
	PID=$(ssh $SSHUser@$ServerIP '$tmpProc = Get-Process -ID '"$1"' -ErrorAction SilentlyContinue; echo $tmpProc.id; exit')
	PID=$(sed 's/[^0-9]//g' <<< "$PID")
	if [[ "$PID" == "$1" ]]; then
		#echo "true"
		return 0 #true
	else
		#echo "false"
		return 1 #false
	fi
}

#create process 0
#<< 'MULTILINE-COMMENT'
	generateFFMPEGString "Cam Link Pro HDMI-4" 4 4 $NGINXIP "PYNQ" 3
	echo $generatedString > /media/ramdisk/proc/p0.cmd
	startRemoteProcess "ffmpeg" "p0"
	p0PID=$PID
#MULTILINE-COMMENT

#create process 1
#<< 'MULTILINE-COMMENT'	
	generateFFMPEGString "Cam Link Pro HDMI-2" 4 4 $NGINXIP "ZedBoard" 2
	echo $generatedString > /media/ramdisk/proc/p1.cmd
	startRemoteProcess "ffmpeg" "p1"
	p1PID=$PID
#MULTILINE-COMMENT	

#<< 'MULTILINE-COMMENT'
#keep processes alive
	while true; do
		sleep 5s
		time=$(date)
		#echo $time
		if checkRemoteProcessIsRunning $p0PID;
		then
			p0PID=$p0PID #echo "true"
		else
			echo "Process $p0PID crashed... restarting - $time"
			startRemoteProcess "ffmpeg" "p0"
			p0PID=$PID
		fi
		if checkRemoteProcessIsRunning $p1PID;
		then
			p1PID=$p1PID #echo "true"
		else
			echo "Process $p1PID crashed... restarting - $time"
			startRemoteProcess "ffmpeg" "p1"
			p1PID=$PID
		fi	
	done
#MULTILINE-COMMENT
#show logfiles
	#gedit /media/ramdisk/error.log 
	#gedit /media/ramdisk/access.log
