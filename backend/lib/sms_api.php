<?php

class sms_api
{
    function send_otp($mobile,$otp,$country_code) {
        include_once 'dao.php';
        $d = new dao();
        $appName = urlencode($d->app_name());
        if ($country_code=="+91") {
            $sms= file_get_contents("https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2eb6de0f-3a58-11e9-8806-0200cd936042&to=$mobile&from=CHPLGP&templatename=CHPLOTP&var1=$otp&var2=$appName&var3=eR7Xv3F0Pax");
            return true;
        }
    }

    function send_otp_admin($otp,$mobile,$society_name,$country_code) {
        $msg = urlencode("$otp is your OTP for OTeRri Admin Login.\nPlease do not share this OTP with anyone.\nThank You,\nCHPL Team.");
        if ($country_code=="+91") {
            $sms= file_get_contents("https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2eb6de0f-3a58-11e9-8806-0200cd936042&to=+91$mobile&from=CHPLGP&templatename=CHPLOTP&var1=$otp&var2=OTeRri Admin&var3=BTCdRuvHlD3");
            return true;
        /*} else if ($country_code=="+234") {
            $mobile = $country_code.$mobile;
            $sms = file_get_contents("https://v2nmobile.com/api/httpsms.php?u=nigeria@fincasys.com&p=Finca@321&m=$msg&r=$mobile&s=FINCASYS&t=1");
            return true;
        }else if ($country_code=="+27") {
            $mobile = $country_code.$mobile;
            $sms = file_get_contents("https://platform.clickatell.com/messages/http/send?apiKey=1xdL2m0pRDqwfaNbesp6AQ==&to=$mobile&content=$msg");
            return true;*/
        }
    }

    function send_voice_otp($mobile,$otp,$country_code) {
        if ($country_code=="+91") {
            $sms= file_get_contents("https://2factor.in/API/V1/2eb6de0f-3a58-11e9-8806-0200cd936042/VOICE/$mobile/$otp");
        } else if ($country_code=="+234") {
        }
    }

    function send_welcome_message($society_id,$mobile,$receiver,$society,$country_code) {
        $society = html_entity_decode($society);
        $society=urlencode($society);
        $mobile=urlencode($mobile);
        $receiver=urlencode($receiver);
        if ($country_code=="+91") {
            $mobileTemp = "$country_code $mobile";
            $mobileTemp = urlencode($mobileTemp);
            $sms= file_get_contents("https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2eb6de0f-3a58-11e9-8806-0200cd936042&to=$mobile&from=chplgp&templatename=mycowelcome&var1=$society&var2=$mobileTemp");
        }
    }

    function send_welcome_message_admin($society_id,$receiver,$role,$society,$mobile,$email,$password,$login_url,$country_code) {
        $role = html_entity_decode($role);
        $society = html_entity_decode($society);
        $role=urlencode($role);
        $society=urlencode($society);
        $mobile=urlencode($mobile);
        $receiver=urlencode($receiver);
        if ($country_code=="+91") {
            // $sms= file_get_contents("https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2eb6de0f-3a58-11e9-8806-0200cd936042&to=$mobile&from=CHPLGP&templatename=ASNWELCOMEADMINNOLINK&var1=$receiver&var2=$role&var3=$society&var4=$mobile&var5=$email&var6=$password");
        }
    }

    function send_sms_password_reset($society_id,$receiver,$mobile,$url,$country_code) {
        $mobile=urlencode($mobile);
        $receiver=urlencode($receiver);
        $url=urlencode($url);
        if ($country_code=="+91") {
            $sms= file_get_contents("https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2eb6de0f-3a58-11e9-8806-0200cd936042&to=$mobile&from=CHPLGP&templatename=ASNOTADMINPASSRESET&var1=$receiver&var2=$url");
        }
    }

    function send_approval_message($society_id,$mobile,$receiver,$country_code) {
        $mobile=urlencode($mobile);
        $receiver=urlencode($receiver);
        if ($country_code=="+91") {
            // $sms= file_get_contents("https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2eb6de0f-3a58-11e9-8806-0200cd936042&to=$mobile&from=CHPLGP&templatename=ASNMEMBERAPPROVAL&var1=$receiver&var2=$mobile");
        }
    }

    function send_welcome_message_whatsapp($configuration_id, $configuration_password, $mobile, $msg){
        $mobile = urlencode($mobile);
        $header = "Welcome to Laundry!";
        $header = urlencode($header);
        $msg = urlencode($msg);
        $sms = file_get_contents("https://media.smsgupshup.com/GatewayAPI/rest?userid=$configuration_id&password=$configuration_password&send_to=$mobile&v=1.1&format=json&msg_type=TEXT&method=SENDMESSAGE&msg=$msg&isTemplate=true&header=$header");
    }
}
