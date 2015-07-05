<?php


class Substitution {

    public function subHTMLReplace($page, $placeholders){
        $htmlToString = file_get_contents('files/' . $page);
        $result = strtr($htmlToString, $placeholders);
        return $result;
    }
} 