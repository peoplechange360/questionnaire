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

				#onStart: (evt) ->
					#var itemEl = evt.item;
					# console.log "start", evt

				onEnd: (evt) ->
					scope.updateOrder.call(scope)
					scope.showOrder.call(scope, $(evt.item))
					return

			});
		return

	showOrder: (elm) ->
		orginalCss = elm.css('backgroundColor')
		elm
			.css "backgroundColor", "#fffbdf"

		setTimeout ->
			elm
				.attr "style", ""
		, 1200

		return

	updateOrder: () ->
		# console.log $("#"+@list+' li select').find('[selected="selected"]')
		# $("#"+@list+' li select').find('[selected="selected"]').each ((ind, elm) ->
		# 	console.log elm
		# 	$(elm).prop("selected", false)
		# 	console.log elm
		#
		# 	return
		# ).bind(@)

		$("#"+@list+' li').each ((ind, elm) ->

			selects = $(elm).find('select')
			if selects.length > 0
				#console.log $ selects
				#$ selects
				#	.val(ind + 1)
				#	.data('new-position', ind + 1)
				indx = ind + 1

				$ selects
					.data 'current-position', indx
					.find 'option[data-position="' + indx + '"]'
					.prop 'selected', 'selected'

			return
		).bind(@)

		return
