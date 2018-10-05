<?php

function check_time(){
	//echo "Checking minute_mark to see when last api requet occured...\n";
	$markfile = "minute_mark";
	$tmpfiles = glob($markfile);
	$now = time();
	$fileexists = 0;
	foreach ($tmpfiles as $tmpfile){
		if (is_file($tmpfile)){
			$fileexists = 1;
			if ($now - filemtime($tmpfile) >= 10 ){ // only run script very 10 seconds
				echo "Found! Deleting file: " . $tmpfile . "\n";
				unlink($tmpfile);
				$cmd = "python ../pyscript/get_challenge_views.py ga:118050252";
				//$result = exec($cmd, $output, $return);
				passthru($cmd);
				touch($markfile);
				echo "Google API request finished.\n";
				echo r_print($output);
				echo $return . "\n";
				
			}
			else {
				$fileage = $now - filemtime($tmpfile);
				echo "File is only " . $fileage . " seconds old.\n";
			}
		}
	}
	if ($fileexists != 1){
		touch($markfile);
		$cmd = "python pytest/get_challenge_views_last30.py ga:118050252";
		$result = exec($cmd, $output, $return);
	}
}

check_time()

?>
