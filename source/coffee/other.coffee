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
				.change @otherChanged.bind({ input: input, container: elm, options: @options })

			$($('input[name="' + inputName + '"]')).each ((ind, elm2) ->
				elm2 = $ elm2

				if elm2.is(input) is false
					elm2.change @otherChanged.bind({ input: input, container: elm, options: @options })

				return
			).bind(@)

			return
		).bind(@)

	otherChanged: (e) ->
		if @input.is(":checked") is true
			@container.removeClass "hide"
		else
			@container.addClass "hide"

			@container.parents('.has-error').each ((ind, elm) ->
				$(elm).removeClass 'has-error'
				return
			).bind(@)

			@container.removeClass('has-error')
			@container.children('.help-block').each ((ind, elm) ->
				$(elm).css 'display', 'none'
			).bind(@)

		# @options.validation.validation.check()
		return
