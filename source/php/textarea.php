<?php
$typeArr = array(
	'brandname' => 'Some dynamic brandname',
	'footertext' => 'Lorem ipsum',
	'introtext' => array(
		"title" => "Lorem ipsum",
		"description" => "Lorem ipsum dolar saté"
	),
	"category" => array(
		"title" => "Persoonlijke prioriteiten",
		"description" => "Lorem ipsum dolar saté"
	),
	"form" => array(
		"action" => "#"
	),
	"questions" => array(
		array(
			"type" => $type,
			// "title" => "Waarom zijn de bananen krom?",
			// "description" => "Denk aan de prioriteiten van onze mensen.",
			"answers" => array(
				array(
					"form" => array(
						"label" => "Omdat ze zo groeien",
						"value" => "1",
						"name" => "waarom"
					)
				),
				array(
					"form" => array(
						"label" => "Omdat ze zo genetisch zijn gemanupiluurd",
						"value" => "2",
						"name" => "waarom2"
					)
				),
				array(
					"form" => array(
						"label" => "Waarom testen",
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
