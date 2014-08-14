<?php
$typeArr = array(
	'brandname' => 'Some dynamic brandname',
	'footertext' => 'Lorem ipsum',
	// 'introtext' => array(
	//     "title" => "Lorem ipsum",
	//     "description" => "Lorem ipsum dolar saté"
	// ),
	"category" => array(
		"title" => "Persoonlijke prioriteiten",
		// "description" => "Lorem ipsum dolar saté"
	),
	"form" => array(
		"action" => "#"
	),
	"questions" => array(
		array(
			"type" => "options",
			// "title" => "Waarom zijn de bananen krom?",
			// "description" => "Denk aan de prioriteiten van onze mensen.",
			"anwsers" => array(
				array(
					"form" => array(
						"label" => "Waarom zijn de bananen krom?",
						"value" => "1",
						"name" => "waarom",
						"required" => true,
						"defaultOption" => "Kies een optie",
						"options" => array(
							array(
								"title" => "Daarom",
								"value" => "daarom"
							),
							array(
								"title" => "Kaarom",
								"value" => "kaarom"
							)
						)
					)
				),
				array(
					"form" => array(
						"label" => "Doe wat mijn leidinggevende/baas wil dat ik doe. Mijn team help om te doen wat er van ons verwacht wordt. Onze culturele waarden en gewoonten in ere houden.",
						"value" => "2",
						"name" => "waarom2",
						"required" => true,
						"defaultOption" => "Kies een optie",
						"options" => array(
							array(
								"title" => "Daarom",
								"value" => "daarom"
							),
							array(
								"title" => "Kaarom",
								"value" => "kaarom"
							)
						)
					)
				),
				array(
					"form" => array(
						"label" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec imperdiet magna, eget vehicula mi. Aenean ac imperdiet odio, sit amet commodo massa. Fusce tincidunt lacus ut hendrerit commodo.",
						"value" => "3",
						"name" => "waarom3",
						"required" => true,
						"defaultOption" => "Kies een optie",
						"options" => array(
							array(
								"title" => "Daarom",
								"value" => "daarom"
							),
							array(
								"title" => "Kaarom",
								"value" => "kaarom"
							)
						)
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
