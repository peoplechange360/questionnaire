<?php
$typeArr = array(
	'brandname' => 'Some dynamic brandname',
	'introtext' => array(
	    "title" => "Introductie",
	    "description" => 'Bedankt voor het meedoen aan <a href="#">PeopleChange scan</a>. Er zijn geen goede of foute antwoorden u kunt gewoon antwoord geven op basis van uw huidige gedachten en gevoelens.'
	),
	"category" => array(
		"title" => "1. Afstemming met baan en organisatiecultuur",
		//"description" => "Lorem ipsum dolar saté"
	),
	"form" => array(
		"action" => "#"
	),
	"questions" => array(
		array(
			"type" => $type,
			"title" => "Mijn baan vereist dat ik...",
			//"description" => "Denk aan de prioriteiten van onze mensen.",
			"answers" => array(
				array(
					"form" => array(
						"label" => "Omdat ze zo groeien",
						"value" => "1",
						"name" => "waarom",
						"required" => true
					)
				),
				array(
					"form" => array(
						"label" => "Omdat ze zo genetisch zijn gemanupiluurd",
						"value" => "2",
						"name" => "waarom",
						"required" => true
					),
					"other" => array(
						"form" => array(
							"label" => "anders, namelijk:",
							"name" => "anders2",
							"required" => true
						)
					)
				),
				array(
					"form" => array(
						"label" => "Waarom testen",
						"value" => "3",
						"name" => "waarom",
						"required" => true,
						"checked" => true
					),
					"other" => array(
						"form" => array(
							"label" => "anders, namelijk:",
							"name" => "anders",
							"required" => true
						)
					)
				)
			)
		)/*,
		array(
			"type" => $type,
			"title" => "Zijn de bananen krom?",
			"description" => "Denk aan de prioriteiten van onze mensen.",
			"answers" => array(
				array(
					"form" => array(
						"label" => "Omdat ze zo groeien",
						"value" => "1",
						"name" => "waarom1",
						"required" => true
					)
				),
				array(
					"form" => array(
						"label" => "Omdat ze zo genetisch zijn gemanupiluurd",
						"value" => "2",
						"name" => "waarom1",
						"required" => true
					),
					"other" => array(
						"form" => array(
							"label" => "anders, namelijk:",
							"name" => "anders21",
							"required" => true
						)
					)
				),
				array(
					"form" => array(
						"label" => "Waarom testen",
						"value" => "3",
						"name" => "waarom1",
						"required" => true,
						"checked" => true
					),
					"other" => array(
						"form" => array(
							"label" => "anders, namelijk:",
							"name" => "anders1",
							"required" => true
						)
					)
				)
			)
		),
		array(
			"type" => "checkbox",
			"title" => "Waarom zijn de bananen krom?",
			"description" => "Denk aan de prioriteiten van onze mensen.",
			"answers" => array(
				array(
					"title" => "Omdat ze zo groeien",
					"value" => "1",
					"name" => "waarom2"
				),
				array(
					"title" => "Omdat ze zo genetisch zijn gemanupiluurd",
					"value" => "2",
					"name" => "waarom2"
				),
				array(
					"title" => "Waarom testen",
					"value" => "3",
					"name" => "waarom2"
				)
			)
		)*/
	),
	"progress" => array(
		"current" => 5,
		"total" => 100,
		"percentage" => 5
	)
);
