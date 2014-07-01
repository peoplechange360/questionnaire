class Validation
	form: $ "#questionnaireForm"
	bootstrap:
		input: '.form-group'
		inputGroup: '.input-group'
		errorClass: 'has-error'
		errorElement: 'span'
		errorElementClass: 'help-block'

	constructor: (options) ->
		@options = options || {};
		@form = options.form || @form || false

		bootstrap = @bootstrap

		@form.validate({
			ignore: ""
			highlight: (element) ->
				$(element).closest(bootstrap.input).addClass(bootstrap.errorClass);
				console.log element
				return

			unhighlight: (element) ->
				$(element).closest(bootstrap.input).removeClass(bootstrap.errorClass);
				return

			submitHandler: (form) ->
				form.submit();
				return

			debug: true
			errorElement: bootstrap.errorElement
			errorClass: bootstrap.errorElementClass
			errorPlacement: (error, element) ->

				if (element.attr("type") == "checkbox" || element.attr("type") == "radio")

					element.closest(bootstrap.input).append(error)
					error.attr("class", error.attr("class") + " " + element.parent().attr("class") + " checkboxes-check")

				else

					if (element.parent(bootstrap.inputGroup).length)
						error.insertAfter element.parent()
					else
						error.insertAfter element
		});

		return
