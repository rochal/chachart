/*
 * Bar chart class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
$chachart.initChartType('bar', function(){
	
	var chart = this,
		options,
		ctx = chart.ctx;

	this.defaultOpts = {
		barWidth: 30,
		spaceBetweenBars: 10,
		labelsOnBarsTemplate: '_NAME_'
	}

	this.init = function()
	{
		//get options
		options = this.options.get();

		//calculate bar width as it depends on number of data items
		options.barWidth = ((this.canvas.height - options.edgePadding) / this.data[0].values.length) - options.spaceBetweenBars;
	}

	this.draw = function()
	{
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				
		//draw all pieces
		if (this.canvas && this.canvas.getContext)
		{
			//calculate starting point for all bars
			var lastY = this.canvas.height - ((this.data[0].values.length + 1) * (options.barWidth + options.spaceBetweenBars));

			for (var i = 0; i < this.data[0].values.length; i++)
			{
				var item = this.data[0].values[i];
				var dataHeight = (this.canvas.width - options.edgePadding) - 
					((item.value / this.data[0].max) * (this.canvas.width - options.edgePadding));

				var top = lastY + options.barWidth + options.spaceBetweenBars;
				var height = (this.canvas.width - options.edgePadding) - dataHeight;
				var width = top + options.barWidth;

				//draw shape on canvas
				ctx.strokeStyle = '#333';

				//set up gradient
				var grad = ctx.createLinearGradient(height, top, height, width);
				grad.addColorStop(0,   $color.darkerColor(item.color, 0.2));
				grad.addColorStop(0.4, item.color);
				grad.addColorStop(0.6, item.color);
				grad.addColorStop(1,   $color.darkerColor(item.color, 0.2));
				
				//draw bar
				$chachart.drawRectangle(ctx, 0, top, width, height, grad);

				//draw labels on
				var yPos = top + options.barWidth / 2;
				this.drawOnChartLabels(ctx, item, yPos);

				//save last position
				lastY = top;
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