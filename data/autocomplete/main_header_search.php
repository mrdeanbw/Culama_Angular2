<?php

$json_data = file_get_contents('../../php/data/pages.json');
$search_query = trim(strip_tags($_POST["search"]));

function search($array, $key, $value) {
    $results = array();
    if (is_array($array)) {
        if (isset($array[$key]) && $array[$key] == $value) {
            $results[] = $array;
        }
        foreach ($array as $subarray) {
            $results = array_merge($results, search($subarray, $key, $value));
        }
    }
    return $results;
}

print_r( json_encode(search(json_decode($json_data, true),'title',$search_query)) );