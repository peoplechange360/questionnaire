class Checkbox
	@uncheckRadio: false,
	checkedElms: {},

	constructor: (options) ->
		@options = options || {};
		{@checkboxes, @uncheckRadio} = options
		@uncheckRadio = @uncheckRadio || false;

		$(@checkboxes).each ((index, element) ->
			elm = $ element
			outer = $ "<div>",
				class: "outer-" + elm.attr "type"
			inner = $ "<div>",
				class: "inner-" + elm.attr "type"

			if elm.is(':checked') is true
				inner.addClass "checked"

			outer.insertBefore(elm)
			outer.append(inner)

			elm
				.click @checkboxChanged.bind({ uncheckRadio: @uncheckRadio, outer: outer, input: elm, scope: @ })
				.addClass "hide"

			return
		).bind(@)

	resetCheckboxes: () ->
		@checkedElms = {}

	checkboxChanged: (e) ->
		elm = $ @input
		inputName = elm.attr("name")
		scope = @scope

		if elm.attr("type") is "radio"
			if @uncheckRadio is true
				if inputName of scope.checkedElms
					if scope.checkedElms[inputName].is(elm) is true

						elm
							.prop 'checked', false
							.prev()
							.removeClass "checked"

						delete scope.checkedElms[inputName]
						elm.trigger "change"
						return

		$($('input[name="' + inputName + '"]')).each (index, element) ->
			if $(element).is(':checked') is true
				$(element)
					.prev()
					.addClass "checked"

			else
				$(element)
					.prev()
					.removeClass "checked"

		scope.checkedElms[inputName] = $ elm

		return
