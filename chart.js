/*
 * Base chart class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 * 
 */
$chachart.chart = function(id, data, addOpts){

	var chart = this,
		node,
		components = [];
	
	this.data = [];
	this.animCounter = 0;
	this.options = null;

	this.opts = function()
	{	
		//default options for all charts
		var defOpts = {
			width: 200,
			height: 200,

			//on chart labels
			labelsOnChart: false,
			labelsOnChartTemplate: '{value}%',
			
			//legend
			unit: ''
		};
		
		this.extend = function(addOpts)
		{
			defOpts = $chachart.$super(defOpts, addOpts);
		}
		
		this.setDefaults = function(addOpts)
		{
			defOpts = $chachart.$super(addOpts, defOpts);
		}
		
		this.get = function(prop, def)
		{
			return (prop) ? (defOpts[prop]) ? defOpts[prop] : def : defOpts;
		}
		
		//return value
		return this;
	}

	this.addComponent = function(comp){
		
		//hold reference to the component
		components[components.length] = comp;
		
		//finally, add it to the html
		var node = comp.node || comp;
		this.node.appendChild(node);
	},
	
	this.center = function()
	{
		return {x: this.options.get().width / 2,
				 y: this.options.get().height / 2};
	}
	
	this.updateData = function(data, redraw)
	{
		//check if we are dealing with one data set, or with many
		if (data.values || (typeof data[0] === "number") || (data[0] && data[0].value))
		{
			//not an array, assuming one dataset
			this.parseDataSet(data, 0);
			this.data.setsMax = this.data[0].max;

			//record maxiumum length of the dataset
			this.data.maxLength = this.data[0].values.length - 1;
		}
		else
		{
			//it is an array, so we assume few datasets

			//modify max so it includes all datasets
			var maxData = [];

			//record the longest dataset
			var maxLength = [];

			for (var i = 0; i < data.length; i++)
			{
				this.parseDataSet(data[i], i);
				maxData[i] = this.data[i].max;
				maxLength[i] = this.data[i].values.length  - 1;
			}
			
			//remember max across all sets
			this.data.setsMax = Math.max.apply(Math, maxData);

			//record maxiumum length of the dataset
			this.data.maxLength = Math.max.apply(Math, maxLength);
		}

		//shall we redraw the chart?
		if (redraw)
		{
			this.draw();
		}
	}
	
	this.parseDataSet = function(data, n)
	{
		var dataSet = [];

		//calculate total and format data set
		var total = 0;

		//store value array to calculate max
		var maxData = [];

		//check if we are dealing with formated dataset object
		var values = (data.values) ? data.values : data;

		for (var d = 0; d < values.length; d++)
		{
			var dta = values[d];
			var item = {};
			var randomColor = 'rgba(' + Math.round(255 * Math.random()) + ',' + Math.round(255 * Math.random()) + ',' + Math.round(255 * Math.random()) + ', 1)';
			var name = "Value " + d;

			if (dta.value)
			{
				//formatted object
				total += dta.value;
				item = {
					value: dta.value,
					color: dta.color || randomColor,
					name: dta.name || name
				}

				//record maximum for this set
				maxData.push(dta.value);
			} 
			else if (typeof dta == "number")
			{
				//normal array
				total += dta;
				item = {
					value: dta,
					color: randomColor,
					name: name
				}

				//record maximum for this set
				maxData.push(dta);
			}
			else if (Object.prototype.toString.call(dta) === "[object Array]")
			{
				//data object is an array.. testing only
				total += dta[1];
				item = {
					value: dta[1],
					color: randomColor,
					name: new Date(dta[0]).toUTCString()
				}

				//record maximum for this set
				maxData.push(dta[1]);
			}

			//add formatted item to dataset
			dataSet.push(item);
		}
		
		//we know total now, updated percents
		for (var d = 0; d < values.length; d++)
		{
			dataSet[d].percent = dataSet[d].value / total;
		}

		var max = Math.max.apply(Math, maxData);

		//save dataset data and all custom properties
		this.data[n] = {
			values: dataSet,
			total: total,
			max: max,
			color: data.color || randomColor,
			name: data.name || "Set " + n
		};
	}
	
	this.update = function(newData, finishedCallback)
	{
		if (typeof newData == 'string' && newData == '#random')
		{
			newData = [];
			for (var i = 0; i < this.data[0].values.length; i++)
			{
				var copy = $chachart.$super({}, this.data[0].values[i]);
				copy.value = Math.round(200 * Math.random())+1;
				newData[i] = copy;
			}
		}

		//ignore if animation is already in progress
		if (this.animCounter > 0)
		{
			return;
		}

		//animate between current data and new data
		this.animCounter = setInterval(function(){ 
			chart.animtick(newData, finishedCallback);
		}, this.options.get().animTick);
	}

	this.stepUpdate = function(newData, finishedCallback)
	{
		if (typeof newData == 'string' && newData == '#random')
		{
			newData = [];
			for (var i = 0; i < this.data[0].values.length; i++)
			{
				var copy = $chachart.$super({}, this.data[0].values[i]);
				copy.value = Math.round(200 * Math.random())+1;
				newData[i] = copy;
			}
		}

		//ignore animation, just redraw
		this.updateData(newData, true);

		//update legend
		//if (this.options.legend.show)
		//{
		//	this.legend.update(newData);
		//}

		//call callback
		if (finishedCallback)
		{
			finishedCallback();
		}
	}

	this.drawXYLines = function(ctx)
	{
		//draw x,y lines
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, this.canvas.height);
		ctx.lineTo(this.canvas.width, this.canvas.height);
		ctx.stroke();
		ctx.closePath();
	}
	
	this.animtick = function(newData, finishedCallback)
	{
		var data = this.data[0].values;
		var complete = 0;
		var dataSet = [];

		//format data set
		for (var d = 0; d < data.length; d++)
		{
			var item = {};
			var direction = 0;

			if (data[d] && newData[d])
			{
				if (~~newData[d].value != ~~data[d].value)
				{
					direction = (newData[d].value > data[d].value) ? 1 : -1;
				}
				else
				{
					complete++;
				}
				item = {
					value: data[d].value + direction,
					color: data[d].color || newData[d].color,
					name: data[d].name || newData[d].name
				};
			}

			dataSet.push(item);
		}

		//if all pieces finished moving, stop animation
		if (complete >= data.length)
		{
			clearInterval(this.animCounter);
			this.animCounter = 0;

			//update legend
			if (this.legend)
			{
				this.legend.update(data);
			}
			
			/*
			if (this.updateLabels && this.options.labels.show)
			{
				this.updateLabels();
			}
			*/
		   
			//if callback was set - call it
			if (finishedCallback)
			{
				//call callback function, passing chart data
				finishedCallback(this);
			}

			return;
		}

		this.updateData(dataSet, true);
	}	
	
	/**
	 * initialize the object once all methods are set
	 */
	//extend default options
	this.options = new this.opts();
	if (this.defaultOpts)
	{
		this.options.extend(this.defaultOpts);
	}
	this.options.extend(addOpts);

	//parse data object
	this.updateData(data);
		
	//parse canvas
	var canvas = document.createElement('canvas');
	canvas.width = this.options.get().width;
	canvas.height = this.options.get().height;
	this.ctx = canvas.getContext("2d");
	this.canvas = canvas;
	
	//create actual html node
	var node = document.createElement('div');
	node.id = id;
	node.className = "chachart-chart";
	$chachart.setStyles(node, {
		fontFamily: 'Tahoma,sans-serif',
		fontSize: '12px'
	});	
	this.node = node;
	
	//create title
	var title = this.options.get().title;
	if (title)
	{		
		var titleNode = document.createElement('div');
		titleNode.innerHTML = title;
		$chachart.setStyles(titleNode, {
			textAlign: 'center',
			fontWeight: 'bold'
		});

		//add title component
		this.addComponent(titleNode);		
	}
	
	//add main canvas component
	this.addComponent(this.canvas);
	
	//create legend
	var legend = this.options.get().legend;
	if (legend)	
	{
		this.legend = new $chachart.legend(this);
		this.addComponent(this.legend);
	}
	
	
	//finally, append node to document
	document.body.appendChild(this.node);
	
	return chart;
};