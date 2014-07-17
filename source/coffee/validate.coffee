class Validation
	form: $ "#questionnaireForm"
	bootstrap:
		input: '.form-group'
		inputContainer: '.input'
		inputGroup: '.input-group'
		radioGroup: '.list-group'
		questionGroup: '.list-group-item'
		panelGroup: '.panel'
		panelGroupErrorClass: 'panel-danger'
		errorClass: 'has-error'
		errorElement: 'span'
		errorElementClass: 'help-block'
		radioErrorText: 'Selecteer één van de verplichten opties.'
		checkboxErrorText: 'Selecteer minimaal één optie.'
		scaleErrorText: 'Selecteer één van de verplichten opties.'

	constructor: (options) ->
		@options = options || {};
		@form = options.form || @form || false

		bootstrap = @bootstrap

		@setCustomMessages()

		@form.attr "novalidate", "novalidate"

		@validation = @form.validate({
			errorElement: bootstrap.errorElement
			errorClass: bootstrap.errorElementClass
			ignore: ":hidden:not(.doValidate), .noValidation"
			highlight: (element) ->
				element = $ element

				element
					.closest(bootstrap.input)
					.addClass(bootstrap.errorClass)

				if (element.parents('table[data-type="scale"]').length > 0)
					element
						.closest("tr")
						.addClass bootstrap.errorClass
						.next()
						.addClass bootstrap.errorClass

				else if (element.attr("type") == "checkbox" || element.attr("type") == "radio")
					element
						.closest bootstrap.radioGroup
						.addClass bootstrap.errorClass

				else
					element
						.closest bootstrap.questionGroup
						.addClass bootstrap.errorClass

				return

			unhighlight: (element) ->
				element = $ element

				element
					.closest bootstrap.input
					.removeClass bootstrap.errorClass

				if (element.parents('table[data-type="scale"]').length > 0)
					element
						.closest("tr")
						.removeClass bootstrap.errorClass
						.next()
						.removeClass bootstrap.errorClass

				else if (element.attr("type") == "checkbox" || element.attr("type") == "radio")
					element
						.closest bootstrap.radioGroup
						.removeClass bootstrap.errorClass

				else
					element
						.closest bootstrap.questionGroup
						.removeClass bootstrap.errorClass

				return

			submitHandler: (form) ->
				form.submit();
				return

			errorPlacement: (error, element) ->

				if (element.data('questionnaire-type') == "scale")

					element
						.closest("tr")
						.children('.title')
						.append(error)

				else if (element.attr("type") == "checkbox" || element.attr("type") == "radio")

					element
						.closest(bootstrap.radioGroup)
						.parent()
						.prepend(error)

					error
						.attr("class", error.attr("class") + " checkboxes-check")

				else

					if (element.parent(bootstrap.inputGroup).length)
						error.insertAfter element.parent()
					else
						error.insertAfter element

				return
		});

		return

	setCustomMessages: () ->
		bootstrap = @bootstrap

		$('input[type="radio"]').each ((index, element) ->
			$ element
				.data 'msg-required', bootstrap.radioErrorText
			return
		).bind(@)

		$('input[type="checkbox"]').each ((index, element) ->
			$ element
				.data 'msg-required', bootstrap.checkboxErrorText
			return
		).bind(@)

		$('table[data-type="scale"]').each ((index, element) ->

			$ element
				.find('input').each ((ind, elm) ->
					$ elm
						.data 'questionnaire-type', 'scale'
						.data 'msg-required', bootstrap.scaleErrorText

					return
				).bind(@)

			return
		).bind(@)

		return
