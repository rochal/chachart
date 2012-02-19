/*
 * Pie chart class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
$chachart.initChartType('pie', function(){
	
	var chart = this,
		options,
		ctx = chart.ctx;
		
	this.defaultOpts = {
		pieRadius: 90,
		defaultRotation: 0,
		isDonut: false,
		isShadow: true
	}

	this.init = function(isRedraw)
	{
		//get options
		options = this.options.get();

		var startAngle = options.defaultRotation;
		for (var i = 0; i < this.data[0].values.length; i++)
		{
			var item = this.data[0].values[i],
				part = item.value / this.data[0].total,
				endAngle = 2 * Math.PI * part;

			//create pie piece
			var piece = isRedraw ? pieces[i] : new piePiece(item);
			piece.start = startAngle;
			piece.end = endAngle;
			piece.label = item.name;
			piece.item = item;

			//draw piece
			startAngle += endAngle;
		}
	}

	var pieces = [];
	
	var drawShadow = function(ctx)
	{
		if (options.isShadow)
		{
			var styles = { stroke: '#fff', fill: '#eee'};
			$chachart.drawCircle(ctx, chart.center(), options.pieRadius + 3, styles);
		}
	}
	
	var drawDonut = function(ctx)
	{
		if (options.isDonut)
		{
			var styles = { stroke: '#eee', fill: '#fff'};
			$chachart.drawCircle(ctx, chart.center(), options.pieRadius * 0.3, styles);	
		}		
	}
	
	var piePiece = function(item, data)
	{
		this.start = null;
		this.end = null;
		this.centerDistance = 0;
		this.label = null;
		this.item = item;
		this.data = data;
		
		this.midAngle = function()
		{
			return this.start + this.end / 2;
		}
		
		this.center = function(dist)
		{
			var dist = dist || 0;
			return {
				x: chart.center().x + (Math.cos(this.midAngle()) * (this.centerDistance+dist)),
				y: chart.center().y + (Math.sin(this.midAngle()) * (this.centerDistance+dist))
			}
		}
		
		this.draw = function(ctx)
		{
			//draw piece
			ctx.strokeStyle = "#fff";
			ctx.fillStyle = this.item.color;
			ctx.beginPath();
			ctx.arc(
				this.center().x,
				this.center().y,
				options.pieRadius,
				this.start,
				this.start+this.end,
				false);
			ctx.lineTo(this.center().x, this.center().y);	
			ctx.closePath();
			ctx.stroke();
			ctx.fill();	

		}
		
		pieces[pieces.length] = this;
		return this;
	}
	
	this.drawLabels = function()
	{
		for (var p in pieces)
		{
			var piece = pieces[p];
			if (options.labelsOnChart && piece.label)
			{
				//draw label on top of the chart
				ctx.font = 'bold 10px sans-serif';
				ctx.fillStyle = $color.isDark(piece.item.color) ? '#fff' : '#000';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				var dist = options.pieRadius*0.7,
					label = $chachart.parseLabel(piece.item, options.labelsOnChartTemplate);
				ctx.fillText(label, piece.center(dist).x, piece.center(dist).y);
			}
		}	
	}

	this.draw = function()
	{
		this.init(true);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		//draw pie shadow
		drawShadow(ctx);

		//draw all pieces
		for (var p in pieces)
		{
			pieces[p].draw(ctx);
		}
		
		//draw labels on top
		this.drawLabels(ctx);

		//draw donut
		drawDonut(ctx);
	}

	return chart;
});