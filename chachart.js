/*
 * Global chart manager
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
var $chachart = {

	charts: [],
	
	comps: [],
	
	//creates new instance of chart type object
	initChartType: function(name, chartClass){

		//add quick reference
		$chachart[name] = function(data, opts){
			
			//create new chart object
			var chart = new $chachart.chart($chachart.charts.length, data, opts);

			//pass it to chart type class
			var makeChart = chartClass.call(chart, chart);
			$chachart.charts[$chachart.charts.length] = makeChart;
			makeChart.options.setDefaults(makeChart.defaultOpts);
			makeChart.init();
			makeChart.draw();
			return makeChart;
		}
	},
	
	//creates new instance of chart component object
	initChartComponent: function(name, compClass){

		//add quick reference
		$chachart[name] = function(chart, opts){
			
			//create new comp object
			var comp = new $chachart.component($chachart.comps.length, chart, opts);

			//pass it to chart type class
			var makeComp = compClass.call(comp, comp);
			$chachart.comps[$chachart.comps.length] = makeComp;
			return makeComp;
		}
	},	
	
	$super: function(object, klass)
	{
		for (var name in klass){
			if (Object.prototype.toString.call(object[name]) === '[object Object]'){
				$chachart.$super(object[name], klass[name]);
			} else {
				object[name] = klass[name];
			}
		}

		return object;
	},
	
	parseLabel: function(item, template)
	{
		//decide what info to show
		var percent = (item.percent*100).toFixed(0);
		
		var templates = {
			'{value}': item.value,
			'{name}': item.name,
			'{percent}': percent
		};

		for (var t in templates)
		{
			var rx = new RegExp(t, 'gi');
			template = template.replace(rx, templates[t]);
		}
		
		return template;
	},
	
	setStyles: function(obj, styles)
	{
		for (var s in styles)
		{
			obj.style[s] = styles[s];
		}
	},
	
	$parseTemplate: function(template, chart)
	{
		//structure can be a string or function
		var structure = typeof(template.structure) == 'string' 
			? template.structure : template.structure(chart);

		for (var i = 0; i < template.data.length; i++)
		{
			structure = structure.replace(template.data[i].key, template.data[i].value);
		}

		return structure;
	},
	
	drawCircle: function(ctx, center, radius, styles)
	{
		ctx.strokeStyle = styles.stroke || "#fff";
		ctx.fillStyle = styles.fill || "#eee";
		ctx.beginPath();
		ctx.arc(
			center.x,
			center.y,
			radius,
			0,
			Math.PI*2,
			false);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	},
	
	drawRectangle: function(ctx, x, y, width, height, fillStyle)
	{
		//fill it with gradient
		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(height, y);
		ctx.lineTo(height, width);
		ctx.lineTo(x, width);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
};
