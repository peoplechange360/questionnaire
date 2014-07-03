<?php
$typeArr = array(
	'brandname' => 'Some dynamic brandname',
	// 'introtext' => array(
	//     "title" => "Lorem ipsum",
	//     "description" => "Lorem ipsum dolar saté"
	// ),
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
			"title" => "Waarom zijn de bananen krom?",
			"description" => "Denk aan de prioriteiten van onze mensen.",
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
							"name" => "anders2"
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
							"name" => "anders"
						)
					)
				)
			)
		)/*,
		array(
			"type" => "table",
			"title" => "Zijn de bananen krom?",
			"description" => "Denk aan de prioriteiten van onze mensen.",
			"answers" => array(
				array(
					"header" => "Mee eens",
					"label" => "Omdat ze zo groeien",
					"value" => "1",
					"name" => "waarom3"
				),
				array(
					"header" => "Mee oneens",
					"label" => "Omdat ze zo genetisch zijn gemanupiluurd",
					"value" => "2",
					"name" => "waarom3"
				),
				array(
					"label" => "Waarom testen",
					"value" => "3",
					"name" => "waarom3"
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
