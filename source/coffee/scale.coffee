class ScaleTable

	constructor: (options) ->
		@options = options || {};
		@options.selectRequired = @options.selectRequired || " -- Selecteer een optie --";
		{@scaleTable} = options

		$(@scaleTable).each ((index, element) ->
			elm = $ element
			headers = elm.find('thead th:not(.title)')
			trs = elm.find('tbody tr')

			$(trs).each ((trIndex, trElm) ->
				options = $(trElm).find('td:not(.title) input')

				$ trElm
					.addClass "input-row"

				tr = $ "<tr>",
					class: 'select-row'
				td = $ '<td colspan="' + (options.length + 1) + '">'

				sel = $ '<select>'

				tr.insertAfter $(trElm)
				tr.append td
				td.append sel

				sel
					.append($('<option>', {
						text: @options.selectRequired,
						value: ""
					}))
					.change @selectChanged.bind({ select: sel, tr: $(trElm), options: @.options })

				$(options).each ((tdIndex, inputElm) ->
					inputElm = $ inputElm

					tmp = $ '<option>',
						html: $(headers[tdIndex]).text() || "",
						value: inputElm.val() || ""

					inputElm.change @inputChanged.bind({ select: sel, input: inputElm, tr: $(trElm) })
					inputElm.on "inputChanged", @inputChanged.bind({ select: sel, input: inputElm, tr: $(trElm) })

					sel.append tmp
					return
				).bind(this)

				return
			).bind(this)

			return
		).bind(this)

	inputChanged: (e) ->
		if @tr.find(":checked").length is 0
			@select.val("")
		else
			@select.val(@input.val())
		return

	selectChanged: (e) ->
		active = @select.find(":selected")
		input = @tr.find("input[value='" + active.val() + "']")

		if active.val() is ""
			@tr
				.find "input:checked"
				.prop 'checked', false
			@tr
				.find ".checked"
				.removeClass 'checked'

			@options.check.resetCheckboxes();
		else
			input
				.prop 'checked', true
				.prev()
				.addClass 'checked'

		input.trigger 'click'
		return
