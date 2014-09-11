class Checkbox
	@uncheckRadio: false,
	checkedElms: {},

	constructor: (options) ->
		@options = options || {};
		{@checkboxes, @uncheckRadio, @allowedAnswers} = options
		@uncheckRadio = @uncheckRadio || false;
		@allowedAnswers = @allowedAnswers || null

		@generateCheckboxes.call(@, false)

	maximumCheckboxes: () ->

		if @allowedAnswers != null

			if @checkboxes.filter(":checked").length >= @allowedAnswers

				$(@checkboxes.filter(":not(:checked)")).each (index, element) ->
					$ element
						.prop "disabled", true
						.closest ".list-group-item"
						.addClass "disabled"

					return

			else

				$(@checkboxes).each (index, element) ->
					$ element
						.prop "disabled", false
						.closest ".list-group-item"
						.removeClass "disabled"

					return

		return

	generateCheckboxes: () ->
		_self = @

		$(@checkboxes).each (index, element) ->
			elm = $ element
			outer = $ "<div>",
				class: "outer-" + elm.attr "type"
			inner = $ "<div>",
				class: "inner-" + elm.attr "type"

			if elm.is(':checked') is true
				outer
					.addClass "checked"

				elm
					.closest ".list-group-item"
					.addClass "checked"

				other = elm
					.closest ".list-group-item"
					.children ".other"

				if other.length > 0
					other
						.removeClass "hide"

				_self.checkedElms[$(elm).attr("name")] = $ elm

			outer
				.insertBefore(elm)
				.append(inner)

			elm
				.click $.proxy(_self.checkboxChanged, { uncheckRadio: _self.uncheckRadio, outer: outer, input: elm, scope: _self })
				#.click _self.checkboxChanged.bind({ uncheckRadio: _self.uncheckRadio, outer: outer, input: elm, scope: _self })
				.addClass "hide"
				.addClass "doValidate"

			return

		@checkboxChanged.call({ uncheckRadio: @uncheckRadio, scope: @, options: @options }, false)
		return

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
							.closest(".list-group-item")
							.removeClass "checked"

						elm
							.prop 'checked', false
							.prev()
							.removeClass "checked"

						delete scope.checkedElms[inputName]
						elm.trigger "change"
						scope.maximumCheckboxes.call(scope, false)
						return

		$('input[name="' + inputName + '"]').each (index, element) ->
			elm2 = $ element

			if elm2.is(':checked') is true

				elm2
					.prev()
					.addClass "checked"

				elm2
					.closest(".list-group-item")
					.addClass "checked"

			else
				elm2
					.prev()
					.removeClass "checked"

				elm2
					.closest(".list-group-item")
					.removeClass "checked"

			scope.checkedElms[inputName] = $ elm
			return

		scope.maximumCheckboxes.call(scope, false)
		return
