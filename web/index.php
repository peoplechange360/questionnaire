<?php
date_default_timezone_set('Europe/Amsterdam');

require_once '../vendor/autoload.php';

$loader = new \Twig_Loader_Filesystem('../source/twig');
$twig = new \Twig_Environment($loader, array(
    'cache' => false
));

require_once './form.extension.twig.php';
$twig->addExtension(new Project_Twig_Extension($twig));

$type = @$_GET["type"];
if($type == "" || !$type) {
    $type = "radio";
}

if($type == "radio" || $type == "checkbox") {
    require_once '../source/php/radio.php';
}else if($type == "scale") {
    require_once '../source/php/scale.php';
}else if($type == "input") {
    require_once '../source/php/input.php';
}else if($type == "textarea") {
    require_once '../source/php/textarea.php';
}else if($type == "options") {
    require_once '../source/php/options.php';
}else if($type == "order") {
    require_once '../source/php/order.php';
}else if($type == "login") {
    require_once '../source/php/login.php';
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


if($type == "login") {
    echo $twig->render('security/login.html.twig', $result);

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
} else {
    echo $twig->render('layout/template.content.html.twig', $result);
}
