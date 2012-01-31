/*
 * Line chart class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
$chachart.initChartType('line', function(){
	
	var chart = this,
		options,
		ctx = chart.ctx;
	
	this.defaultOpts = {
		fillUnder: false,	//fill the chart under the line
		showPoints: true
	}

	this.dataPoints = [];

	this.init = function()
	{
		//get options
		options = this.options.get();
	}

	//actual point coordinates on canvas
	this.calculateCoordinates = function()
	{
		for (var d = 0; d < this.data.length; d++)
		{
			var dataSet = this.data[d];
			var points = [];

			for (var i = 0; i < dataSet.values.length; i++)
			{
				var item = dataSet.values[i];
				var dataHeight = (item.value / this.data.setsMax) * this.canvas.height;

				if (!item.color)
				{
					item.color = 'rgba(0,' + Math.round(255 * Math.random()) + ',' + Math.round(255 * Math.random()) + ', 1)';
				}

				var distance = this.canvas.width / this.data.maxLength;

				if (options.pointDistance)
				{
					distance = options.pointDistance;
				}

				var padding = this.options.get('edgePadding', 0);
				var left = (distance * i);
				var height = this.canvas.height - dataHeight + padding;

				//remember points so we can draw lines/curves later
				points.push({x:left, y:height, color:item.color});
			}

			//remember actual coordinates for all points
			this.dataPoints[d] = points;
		}
	}

	//draw lines
	this.drawDataGraph = function()
	{
		for (var d = 0; d < this.data.length; d++)
		{
			var dataSet = this.data[d];
			var points = this.dataPoints[d];
			
			//draw lines
			ctx.strokeStyle = dataSet.color;
			ctx.fillStyle = $color.hex2rgba(dataSet.color, 0.6);
			ctx.beginPath();

			if (options.fillUnder)
			{
				ctx.moveTo(points[0].x, this.canvas.height);
				ctx.lineTo(points[0].x, points[0].y);
			}
			else
			{
				ctx.moveTo(points[0].x, points[0].y);
			}
			for (i = 0; i < points.length; i++)
			{
				if (points[i+1])
				{
					ctx.lineTo(points[i+1].x, points[i+1].y);
				}

				//last item
				if (options.fillUnder && i == points.length-1)
				{
					ctx.lineTo(points[i].x, this.canvas.height);
				}
			}
			if (options.fillUnder)
			{
				ctx.lineTo(points[0].x, this.canvas.height);
				ctx.closePath();
			}

			ctx.stroke();

			if (options.fillUnder)
			{
				ctx.fill();
			}

			//check if we should draw points
			var showPoints = dataSet.showPoints != undefined
				? dataSet.showPoints : options.showPoints;
			if (showPoints)
			{
				for (i = 0; i < points.length; i++)
				{
					//draw all points
					ctx.strokeStyle = "#333";
					ctx.fillStyle = dataSet.values[i].color;
					ctx.beginPath();
					ctx.arc(points[i].x, points[i].y-1, 3, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.stroke();
					ctx.fill();
				}
			}
		}
	}

	this.draw = function()	
	{
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		//draw all pieces
		if (this.canvas && this.canvas.getContext)
		{
			//calculate the actual coordinates of the points on canvas
			this.calculateCoordinates();

			//draw the data lines
			this.drawDataGraph(ctx);
		
			this.drawXYLines(ctx);			
		}		
	}

	return chart;
});