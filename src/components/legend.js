/*
 * Legend class
 * Copyright (c) Piotr Rochala
 * http://rocha.la/
 *
 */
$chachart.initChartComponent('legend', function(){

  this.node = null;
  this.wrapper = null;

  var options = this.chart.options;

  this.templates = {
    title: '<b>{title}</b>',
    content: '{rows}',
    row: '<div class="chachart-icon" style="background-color:{color}"></div>{name} {value}',
    setRow: '<div class="chachart-legendrow"><div class="chachart-icon" style="background-color:{color}"></div>{name} {value}</div>'
  }

  this.build = function()
  {
    //built out wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'chachart-legend-out-wrapper';
    this.wrapper.style.height = this.chart.options.height + 'px';

    //built wrapper
    var divWrapper = document.createElement('div');
    divWrapper.className = 'chachart-legend-wrapper';

    //built html and draw it
    var div = document.createElement('div');
    div.id = this.id;
    div.className = 'chachart-legend';
    this.node = div;

    divWrapper.appendChild(this.node);
    this.wrapper.appendChild(divWrapper);

    //update data
    this.update();
  }

  this.update = function(selected)
  {
    var html = '';

    /*
    if (options.setsOnly)
    {
      var rows = '';

      for (var i = 0; i < this.chart.data.length; i++)
      {
        var selectedSetValue = '';

        //check if we should update setpoints
        if (selected && selected.setPoints)
        {
          selectedSetValue = selected.setPoints[i] ? '(' + selected.setPoints[i].value + ')': '';
        }

        //replace tokens from template with data
        var templateData = $chachart.$parseTemplate({
          structure: this.templates.setRow,
          data: [
            {key: '{color}', value: this.chart.data[i].color},
            {key: '{name}', value: this.chart.data[i].name},
            {key: '{value}', value: selectedSetValue}
          ]
        }, this.chart);
        rows += templateData;
      }

      //only set title if needed
      if (options.title)
      {
        //replace tokens from template with data
        var titleTemplate = $chachart.$parseTemplate({
          structure: this.templates.title,
          data: [
            {key: '{title}', value: options.get('title', '')}
          ]
        }, this.chart);
        html += titleTemplate;
      }

      //replace tokens from template with data
      var contentTemplate = $chachart.$parseTemplate({
        structure: this.templates.content,
        data: [
          {key: '{rows}', value: rows}
        ]
      }, this.chart);
      html += contentTemplate;
    }
    else
    {
    */

    var unit = options.get('unit', '');

    for (var i = 0; i < this.chart.data.length; i++)
    {
      //build all rows
      var data = this.chart.data[i].values;

      if (data)
      {
        var d = data.length;
        this.node.innerHTML = '';
        while(d--)
        {
          var row = document.createElement('div');
          row.className = 'chachart-legendrow';
          row.chartItemId = d;

          //replace tokens from template with data
          var templateData = $chachart.$parseTemplate({
            structure: this.templates.row,
            data: [
              {key: '{color}', value: data[d].color},
              {key: '{value}', value: '('+(data[d].value).toFixed(2)+unit+')'},
              {key: '{name}', value: data[d].name}
            ]
          }, this.chart);

          row.innerHTML = templateData;

          //add mouseover handler
          var t = this;
          row.onmouseover = function(e) { t._onmouseover(e); };
          row.onmouseout = function(e) { t._onmouseout(e); };

          this.node.appendChild(row);
        }
      }

      //only set title if really needed
      if (options.title)
      {
        //replace tokens from template with data
        var titleTemplate = $chachart.$parseTemplate({
          structure: this.templates.title,
          data: [
            {key: '{title}', value: options.title}
          ]
        }, this.chart);
        html += titleTemplate;
      }

      /*
      //replace tokens from template with data
      var contentTemplate = $chachart.$parseTemplate({
        structure: this.templates.content,
        data: [
          {key: '{title}', value: options.get('title', this.chart.data[i].name)},
          {key: '{rows}', value: rows}
        ]
      }, this.chart);

      html += contentTemplate;
      */
    }

    //}

    //update legend html
    //this.node.innerHTML = html;

  }

  this._onmouseover = function(e)
  {
    if (this.chart._onLegendRowMouseOver)
    {
      var itemId = e.target.chartItemId;
      this.chart._onLegendRowMouseOver(itemId)
    }
  }


  this._onmouseout = function(e)
  {
    if (this.chart._onLegendRowMouseOut)
    {
      var itemId = e.target.chartItemId;
      this.chart._onLegendRowMouseOut(itemId)
    }
  }

  this.build();

  return this;
});