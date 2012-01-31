/*
 * Column chart class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
$chachart.initChartType('column', function(){
	
	var chart = this,
		options,
		ctx = chart.ctx;
		
	this.defaultOpts = {
		colWidth: 30,
		spaceBetweenCols: 10,
		labelsOnColsTemplate: '_NAME_',
		edgePadding: 10 //padding on the top/right between bars and edges
	}

	this.init = function()
	{
		//get options
		options = this.options.get();

		//calculate column width as it depends on number of data items
		options.colWidth = ((this.canvas.width - options.edgePadding) / this.data[0].values.length) - options.spaceBetweenCols;
	}

	this.draw = function()
	{
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		//draw all pieces
		if (this.canvas && this.canvas.getContext)
		{
			//calculate starting point for all columns
			var lastX = this.canvas.width - ((this.data[0].values.length + 1) * (options.colWidth + options.spaceBetweenCols));

			for (var i = 0; i < this.data[0].values.length; i++)
			{
				var item = this.data[0].values[i];
				var dataHeight = (this.canvas.height - options.edgePadding) - 
					((item.value / this.data[0].max) * (this.canvas.height - options.edgePadding));

				var left = lastX + options.colWidth + options.spaceBetweenCols;
				var height = (this.canvas.height - options.edgePadding) - dataHeight;
				var width = left + options.colWidth;

				//draw shape on canvas
				ctx.strokeStyle = '#333';

				//set up gradient
				var grad = ctx.createLinearGradient(left, height, width, height);
				grad.addColorStop(0,   $color.darkerColor(item.color, 0.2));
				grad.addColorStop(0.4, item.color);
				grad.addColorStop(0.6, item.color);
				grad.addColorStop(1,   $color.darkerColor(item.color, 0.2));
				
				//draw bar
				$chachart.drawRectangle(ctx, left, this.canvas.height, height, width, grad);

				//draw labels on
				var yPos = left + options.barWidth / 2;
				this.drawOnChartLabels(ctx, item, yPos);

				//save last position
				lastX = left;
			}
		}
		
		this.drawXYLines(ctx);
	}
	
	this.drawOnChartLabels = function(ctx, item, yPosition)
	{
		if (options.labelsOnChart)
		{
			var label = $chachart.$parseTemplate({
				structure: options.labelsOnBarsTemplate,
				data: [
					{key: '_NAME_', value: item.name},
					{key: '_VALUE_', value: item.value}
				]
			}, this.chart);

			//draw labels on top of the chart
			ctx.font = 'bold 12px sans-serif';
			ctx.fillStyle = $color.isDark(item.color) ? '#fff' : '#000';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			ctx.fillText(label, options.edgePadding, yPosition);					
		}
	}

	return chart;
});