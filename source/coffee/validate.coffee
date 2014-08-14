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
		errorRequireFromGroup: 'Please fill at least {0} of these fields.'

	constructor: (options) ->
		@options = options || {};
		@form = options.form || @form || false
		@allowedAnswers = options.allowedAnswers || @allowedAnswers || null

		bootstrap = @bootstrap

		@addCustomMethods()
		@setCustomMessages()

		@validation = @form.validate({
			debug: true,
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

		if $('#sonata_user_registration_form_plainPassword_first').length
			if $('#sonata_user_registration_form_plainPassword_second').length

				$('#sonata_user_registration_form_plainPassword_second')
					.rules "add",
						equalTo : "#sonata_user_registration_form_plainPassword_first"

		if @allowedAnswers != null
			if @allowedAnswers > 1

				$(@form.selector + " .checkbox input").each ((index, element) ->

					$("#" + $(element).attr('id'))
						.rules "add",
							require_from_group: [ @allowedAnswers, ".checkbox input" ]

					return

				).bind(this)

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

	addCustomMethods: () ->
		bootstrap = @bootstrap

		jQuery.validator.addMethod "require_from_group", (value, element, options) ->
			$fields = $ options[1], element.form
			$fieldsFirst = $fields.eq 0
			validator = $fieldsFirst.data("valid_req_grp") ? $.extend({}, this)

			isValid = $fields.filter () ->
				return $(this).is(":checked");
			.length >= options[0]

			# Store the cloned validator for future validation
			$fieldsFirst.data "valid_req_grp", validator

			# If element isn't being validated, run each require_from_group field's validation rules
			if (!$(element).data("being_validated"))

				$fields.data "being_validated", true
				$fields.each () ->
					validator.element this
					return

				$fields.data "being_validated", false;

			return isValid

		, jQuery.validator.format bootstrap.errorRequireFromGroup

		return
