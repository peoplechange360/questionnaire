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
				.find('select')
				.data('position', ind+1)
				.change (evt) ->
					current = parseFloat($(this).val()) - 1

					if current == 0
						$("#"+scope.list)
							.prepend($(this).closest('li'))

					else if current < parseFloat($(this).data('position'))
						$("#"+scope.list+' li')
							.eq(current)
							.before($(this).closest('li'))
					else
						$("#"+scope.list+' li')
							.eq(current)
							.after($(this).closest('li'))

					scope.updateOrder.call(scope)
					scope.showOrder.call(scope, $(this).closest('li'))
					return

			return

		if document.getElementById(@list) is defined
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
			console.log elm
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
				$ selects
					.val(ind + 1)
					.data('position', ind + 1)

			return
		).bind(@)

		return
