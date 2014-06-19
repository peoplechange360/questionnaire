<?php
date_default_timezone_set('Europe/Amsterdam');

require_once 'source/vendors/twig/lib/Twig/Autoloader.php';
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('twig');
$twig = new Twig_Environment($loader, array(
    'cache' => false
));

echo $twig->render('layout/template.html.twig',
    array(
        'brandname' => 'Some dynamic brandname',
        'introtext' => "Lorem ipsum"
    )
);
