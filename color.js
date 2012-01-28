//color changing code is not mine, __need to refactor that shit___
var $color = {
	random: function(o)
	{
		var opacity = o ? o : 0;
		return 'rgba(100,' + Math.round(255 * Math.random()) + ',' + Math.round(255 * Math.random()) + ', '+opacity+')';
	},

	pad: function(num, totalChars)
	{
		var pad = '0';
		num = num + '';
		while (num.length < totalChars) {
			num = pad + num;
		}
		return num;
	},

	// Ratio is between 0 and 1
	changeColor: function(color, ratio, darker) {
		// Trim trailing/leading whitespace
		color = color.replace(/^\s*|\s*$/, '');

		// Expand three-digit hex
		color = color.replace(
			/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
			'#$1$1$2$2$3$3'
		);

		// Calculate ratio
		var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
			// Determine if input is RGB(A)
			rgb = color.match(new RegExp('^rgba?\\(\\s*' +
				'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
				'\\s*,\\s*' +
				'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
				'\\s*,\\s*' +
				'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
				'(?:\\s*,\\s*' +
				'(0|1|0?\\.\\d+))?' +
				'\\s*\\)$'
			, 'i')),
			alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

			// Convert hex to decimal
			decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
				/^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
				function() {
					return parseInt(arguments[1], 16) + ',' +
						parseInt(arguments[2], 16) + ',' +
						parseInt(arguments[3], 16);
				}
			).split(/,/),
			returnValue;

		// Return RGB(A)
		return !!rgb ?
			'rgb' + (alpha !== null ? 'a' : '') + '(' +
				Math[darker ? 'max' : 'min'](
					parseInt(decimal[0], 10) + difference, darker ? 0 : 255
				) + ', ' +
				Math[darker ? 'max' : 'min'](
					parseInt(decimal[1], 10) + difference, darker ? 0 : 255
				) + ', ' +
				Math[darker ? 'max' : 'min'](
					parseInt(decimal[2], 10) + difference, darker ? 0 : 255
				) +
				(alpha !== null ? ', ' + alpha : '') +
				')' :
			// Return hex
			[
				'#',
				$color.pad(Math[darker ? 'max' : 'min'](
					parseInt(decimal[0], 10) + difference, darker ? 0 : 255
				).toString(16), 2),
				$color.pad(Math[darker ? 'max' : 'min'](
					parseInt(decimal[1], 10) + difference, darker ? 0 : 255
				).toString(16), 2),
				$color.pad(Math[darker ? 'max' : 'min'](
					parseInt(decimal[2], 10) + difference, darker ? 0 : 255
				).toString(16), 2)
			].join('');
	},

	lighterColor: function(color, ratio)
	{
		return $color.changeColor(color, ratio, false);
	},

	darkerColor: function(color, ratio)
	{
		return $color.changeColor(color, ratio, true);
	},

	hex2rgba: function(hexcol, opacity)
	{
		//remove #
		var hex = ( hexcol.charAt(0) == '#' ? hexcol.substr(1) : hexcol );
		var r, g, b;

		//parse 6 or 3 letter hex
		if (hex.length === 6)
		{
		  r = parseInt(hex.substring(0, 2), 16);
		  g = parseInt(hex.substring(2, 4), 16);
		  b = parseInt(hex.substring(4, 6), 16);
		}
		else if (hex.length === 3)
		{
		  r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
		  g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
		  b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
		}

		// set results
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
	  },

	  isDark: function(hexcol)
	  {
		//remove #
		var hex = ( hexcol.charAt(0) == '#' ? hexcol.substr(1) : hexcol );
		var r, g, b;

		//parse 6 or 3 letter hex
		if (hex.length === 6)
		{
		  r = parseInt(hex.substring(0, 2), 16);
		  g = parseInt(hex.substring(2, 4), 16);
		  b = parseInt(hex.substring(4, 6), 16);
		}
		else if (hex.length === 3)
		{
		  r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
		  g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
		  b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
		}

		//lets say color is dark when:
		return (r + g + b < 200);
	  }
}