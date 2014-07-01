class Other
	constructor: (options) ->
		@options = options || {}
		@options.other = @options.other || false

		@options.other.each ((index, element) ->
			elm = $ element

			input = elm
				.prev()
				.find('input')

			inputName = input.attr "name"

			input
				.change @otherChanged.bind({ input: input, container: elm })
				# .on "inputChanged", @otherChanged.bind({ input: input, container: elm })

			$($('input[name="' + inputName + '"]')).each ((ind, elm2) ->
				elm2 = $ elm2

				if elm2.is(input) is false
					elm2.change @otherChanged.bind({ input: input, container: elm })

				return
			).bind(this)

			return
		).bind(this)

	otherChanged: (e) ->
		if @input.is(":checked") is true
			@container.removeClass "hide"
		else
			@container.addClass "hide"
		return;
