class Table

	constructor: (options) ->

		num = 0
		$('table[data-type="scale"] tbody tr.input-row').each ((trIndex, trElm) ->
			elm = $(trElm)
			className = if num == 0 then "odd" else "even"
			console.log elm, num, elm.hasClass('input-row'), className

			if elm.hasClass('input-row')
				elm
					.addClass className

				if elm.next().hasClass('select-row')
					elm
						.next()
						.addClass className

			if num == 0
				num = 1
			else
				num = 0
			return
		).bind(@)

		return
