class Table

	constructor: (options) ->

		num = 0
		$('table[data-type="scale"] tbody tr.input-row').each ((trIndex, trElm) ->
			elm = $(trElm)
			className = if num == 0 then "odd" else "even"

			if elm.hasClass('input-row')
				elm
					.addClass className

				if elm.next().hasClass('select-row')
					elm
						.next()
						.addClass className

			num = if num == 0 then 1 else 0
			return
		).bind(@)

		return
