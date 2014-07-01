<?php
$typeArr = array(
	'brandname' => 'Some dynamic brandname',
	'introtext' => array(
	    "title" => "Lorem ipsum",
	    "description" => "Lorem ipsum dolar saté"
	),
	"category" => array(
		"title" => "Persoonlijke prioriteiten",
		// "description" => "Lorem ipsum dolar saté"
	),
	"form" => array(
		"action" => "#"
	),
	"questions" => array(
		array(
			"type" => $type,
			// "title" => "Waarom zijn de bananen krom?",
			// "description" => "Denk aan de prioriteiten van onze mensen.",
			"anwsers" => array(
				array(
					"form" => array(
						"label" => "Waarom zijn de bananen krom?",
						"value" => "1",
						"name" => "waarom"
					)
				),
				array(
					"form" => array(
						"label" => "Waarom zijn de tomaten rond?",
						"value" => "2",
						"name" => "waarom2"
					)
				),
				array(
					"form" => array(
						"label" => "Waarom zijn de mango's elliptisch?",
						"value" => "3",
						"name" => "waarom3"
					)
				)
			)
		)
	),
	"progress" => array(
		"current" => 5,
		"total" => 100,
		"percentage" => 5
	)
);
