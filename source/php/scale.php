<?php
$typeArr = array(
	'brandname' => 'Some dynamic brandname',
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
			"type" => "scale",
			"title" => "Waarom zijn de bananen krom?",
			"description" => "Denk aan de prioriteiten van onze mensen.",
			"answers" => array(
				array(
					"title" => "Waarom rollen we zo?",
					"required" => true,
					"answers" => array(
						array(
							"form" => array(
								"label" => "Mee eens",
								"value" => "1",
								"name" => "waarom1"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee eens",
								"value" => "2",
								"name" => "waarom1"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee oneens",
								"value" => "3",
								"name" => "waarom1"
							)
						),
						array(
							"form" => array(
								"label" => "Mee oneens",
								"value" => "4",
								"name" => "waarom1"
							)
						)
					)
				),
				array(
					"title" => "Waarom draaien we zo?",
					"answers" => array(
						array(
							"form" => array(
								"label" => "Mee eens 2",
								"value" => "1",
								"name" => "waarom2"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee eens",
								"value" => "2",
								"name" => "waarom2"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee oneens",
								"value" => "3",
								"name" => "waarom2"
							)
						),
						array(
							"form" => array(
								"label" => "Mee oneens",
								"value" => "4",
								"name" => "waarom2"
							)
						)
					)
				),
				array(
					"title" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt eros quis eros ultrices, dapibus malesuada nibh congue. Praesent a accumsan eros.",
					"answers" => array(
						array(
							"form" => array(
								"label" => "Mee eens",
								"value" => "1",
								"name" => "waarom3"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee eens",
								"value" => "2",
								"name" => "waarom3"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee oneens",
								"value" => "3",
								"name" => "waarom3"
							)
						),
						array(
							"form" => array(
								"label" => "Mee oneens",
								"value" => "4",
								"name" => "waarom3"
							)
						)
					)
				),
				array(
					"title" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt eros quis eros ultrices, dapibus malesuada nibh congue. Vivamus tincidunt eros quis eros ultrices, dapibus malesuada nibh congue. Praesent a accumsan eros.",
					"answers" => array(
						array(
							"form" => array(
								"label" => "Mee eens",
								"value" => "1",
								"name" => "waarom4"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee eens",
								"value" => "2",
								"name" => "waarom4"
							)
						),
						array(
							"form" => array(
								"label" => "Bijna mee oneens",
								"value" => "3",
								"name" => "waarom4"
							)
						),
						array(
							"form" => array(
								"label" => "Mee oneens",
								"value" => "4",
								"name" => "waarom4"
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
