<?php
date_default_timezone_set('Europe/Amsterdam');

require_once 'source/vendors/autoload.php';

$loader = new \Twig_Loader_Filesystem('twig');
$twig = new \Twig_Environment($loader, array(
    'cache' => false
));

require_once 'form.extension.twig.php';
$twig->addExtension(new Project_Twig_Extension($twig));

$type = @$_GET["type"];
if($type == "" || !$type) {
    $type = "radio";
}

if($type == "radio" || $type == "checkbox") {
    require_once 'source/php/radio.php';
}else if($type == "scale") {
    require_once 'source/php/scale.php';
}else if($type == "input") {
    require_once 'source/php/input.php';
}else if($type == "textarea") {
    require_once 'source/php/textarea.php';
}else if($type == "options") {
    require_once 'source/php/options.php';
}

$menu = array(
    "menu" => array(
        array(
            "title" => "Uitloggen",
            "icon" => "power-off",
            "url" => "#"
        ),
        array(
            "title" => "Instellingen",
            "icon" => "cog",
            "url" => "#"
        )
    )
);
$result = array_merge($typeArr, $menu);

echo $twig->render('layout/template.content.html.twig', $result);
