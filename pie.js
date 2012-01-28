/*
 * Pie chart class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
$chachart.initChartType('pie', function(){
	
	var chart = this,
		options = chart.options.get(),
		ctx = chart.ctx;
		
	this.name = 'pie';
	
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
	},

	this.init = function(isRedraw)
	{
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
	
	this.animate = function(end, piece, method, callback)
	{
		var ticker = setInterval(function(){
			
			var delta = piece.centerDistance - end;
			
			if (delta != 0)
			{
				method(delta <= 0);
			} else {
				
				//clear interval when animation ends
				clearInterval(ticker);
				
				if (callback)
				{
					callback();
				}	
			}

			//redraw pices
			chart.draw();
			
		}, 100);
	}
	
	var slideOutTimer = 0;
	var slideOutPiece = function(index)
	{		
		if (slideOutTimer == 0)
		{
			//slide out the piece
			slideOutTimer = setInterval(function(){
				if (pieces[index].centerDistance <= 10)
				{
					pieces[index].centerDistance +=	2;
					chart.draw();
				}
				else
				{
					clearInterval(slideOutTimer);
					slideOutTimer = 0;
				}
			}, 5);
		}
		//pieces[index].centerDistance = 10;
		//chart.draw();
	}
	
	this._onLegendRowMouseOver = function(index)
	{
		//slideOutPiece(pieces.length-1-index)
	}
	
	this._onLegendRowMouseOut = function(index)
	{
		//slide in all other pieces
		for (var p in pieces)
		{
			pieces[p].centerDistance = 0;
			chart.draw();
		}	
	}
	
	//now we can draw it
	this.init();
	this.draw();
	return this;
});