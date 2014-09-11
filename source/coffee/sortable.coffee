class SortableClass
	list: "sortable-list"

	constructor: (options) ->
		@options = options || {}
		scope = @

		$("#"+@list+' li').each (ind, elm) ->
			elm = $ elm

			div = $ '<div>',
				'class': 'handle'
				'html': '<i class="fa fa-arrows"></i>'

			elm
				.prepend div
				.find 'select'
				.data 'current-position', ind + 1
				.change (evt) ->
					selectedPosition = parseFloat($(this).find("option:selected").data('position'))
					currentPosition = selectedPosition - 1
					currentListPosition = parseFloat($(this).data('current-position'))
					li = $(this).closest('li')

					if currentPosition == 0
						$ "#" + scope.list
							.prepend li

					else if currentPosition < currentListPosition
						$ "#" + scope.list + ' li'
							.eq currentPosition
							.before li
					else
						$ "#" + scope.list + ' li'
							.eq currentPosition
							.after li

					scope.updateOrder.call scope
					scope.showOrder.call scope, $(this).closest('li')

					return

			return

		if document.getElementById(@list)?
			@sortableInstance = new Sortable(document.getElementById(@list), {
				handle: '.handle'

				onEnd: (evt) ->
					scope.updateOrder.call scope
					scope.showOrder.call scope, $(evt.item)
					return

			});

		# First change order so data-position match their position
		scope.initOrder.call scope

		# Update order
		scope.updateOrder.call scope
		scope.showOrder.call scope, $(this).closest('li')

		return

	initOrder: () ->
		_self = @

		# Store position in loopable array
		positions = []

		# Loop all listing items
		$("#"+@list+' li').each (ind, elm) ->
			selects = $(elm).find('option[selected="selected"]')

			# Store selected state into the array
			$(selects).each (ind, elm) ->
				curPosition = $(elm).data('position')

				if positions[curPosition]?
					throw new Error "Order module position conflict: " + curPosition + " is selected twice.";
				else
					positions[curPosition] = elm;

				return

			return

		# Prepend all listing items based on their selected state (1,2,3,4,5,6,etc)
		$(positions).each (ind, elm) ->
			$("#"+_self.list).append $(elm).closest("li")
			return

		return

	showOrder: (elm) ->
		orginalCss = elm.css 'backgroundColor'

		elm
			.css "backgroundColor", "#fffbdf"

		setTimeout ->
			elm
				.attr "style", ""
		, 1200

		return

	updateOrder: () ->

		$("#"+@list+' li').each (ind, elm) ->

			selects = $(elm).find('select')
			if selects.length > 0
				indx = ind + 1

				$ selects
					.data 'current-position', indx
					.find 'option[data-position="' + indx + '"]'
					.prop 'selected', 'selected'

			return

		return
