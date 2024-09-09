ig.module(
	'plugins.painter'
)
.requires(
	'impact.impact',
	'impact.system'
)
.defines(function(){

ig.Painter = ig.Class.extend({
    drawFillText: function(option) {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'fill');

        //main action
        ig.system.context.fillText( option.text, option.x, option.y);

        //restore setting
        ig.system.context.restore();
    },
    drawStrokeText: function(option) {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'stroke');

        //main action
        ig.system.context.strokeText( option.text, option.x, option.y);

        //restore setting
        ig.system.context.restore();        
    },
    drawFillCircle: function(option) {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'fill');

        //main action
        ig.system.context.beginPath();
        ig.system.context.arc(option.centerX, option.centerY, option.radius, 0, 2 * Math.PI, false);
        ig.system.context.fill();

        //restore setting
        ig.system.context.restore();

    },
    drawStrokeCircle: function(option) {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'stroke');

        //main action
        ig.system.context.beginPath();
        ig.system.context.arc(option.centerX, option.centerY, option.radius, 0, 2 * Math.PI, false);
        ig.system.context.stroke();

        //restore setting
        ig.system.context.restore();
    },
    drawFillRect: function(option) {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'fill');

        //main action
        ig.system.context.fillRect( option.x, option.y, option.width, option.height);

        //restore setting
        ig.system.context.restore();
    },
    drawStrokeRect: function(option){
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'stroke');

        //main action
        ig.system.context.strokeRect(option.x, option.y, option.width, option.height);

        //restore setting
        ig.system.context.restore();

    },
    drawFillRectCorner: function(option)
    {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'fill');

        //main action
        ig.system.context.beginPath();
        ig.system.context.moveTo(option.x + option.radius, option.y);
        ig.system.context.lineTo(option.x + option.width - option.radius, option.y);
        ig.system.context.arcTo(option.x + option.width, option.y, option.x + option.width, option.y + option.radius, option.radius);
        ig.system.context.lineTo(option.x + option.width, option.y + option.height - option.radius);
        ig.system.context.arcTo(option.x + option.width, option.y + option.height, option.x - option.radius, option.y + option.height, option.radius);
        ig.system.context.lineTo(option.x + option.radius, option.y + option.height);
        ig.system.context.arcTo(option.x, option.y + option.height, option.x, option.height - option.radius, option.radius);
        ig.system.context.lineTo(option.x, option.y + option.radius);
        ig.system.context.arcTo(option.x, option.y, option.x + option.radius, option.y, option.radius);
        ig.system.context.fill();      

        //restore setting
        ig.system.context.restore();
    },
    drawStrokeRectCorner: function(option)
    {
        //save setting
        ig.system.context.save();

        //apply setting
        this.apply(option, 'stroke');

        //main action
        ig.system.context.beginPath();
        ig.system.context.moveTo(option.x + option.radius, option.y);
        ig.system.context.lineTo(option.x + option.width - option.radius, option.y);
        ig.system.context.arcTo(option.x + option.width, option.y, option.x + option.width, option.y + option.radius,  option.radius);
        ig.system.context.lineTo(option.x + option.width, option.y + option.height - option.radius);
        ig.system.context.arcTo(option.x + option.width, option.y + option.height, option.x - option.radius, option.y + option.height, option.radius);
        ig.system.context.lineTo(option.x + option.radius, option.y + option.height);
        ig.system.context.arcTo(option.x, option.y + option.height, option.x, option.height - option.radius,  option.radius);
        ig.system.context.lineTo(option.x, option.y + option.radius);
        ig.system.context.arcTo(option.x, option.y, option.x + option.radius, option.y,  option.radius);
        ig.system.context.stroke();

        //restore setting
        ig.system.context.restore();

    },

    //settings applier
    apply: function(option, action) {
        for(var key in option) {
            var value = option[key];
            switch ( key ) {
                case 'rotate':
                ig.system.context.translate( option.x, option.y);
                ig.system.context.rotate(Math.PI / 4);
                break;

                case 'alpha':
                ig.system.context.globalAlpha = value;
                break;

                case 'lineWidth':
                ig.system.context.lineWidth = value;
                break;

                case 'color':
                if ( action == 'stroke') {
                    ig.system.context.strokeStyle = value;
                }
                else {
                    ig.system.context.fillStyle = value;
                }
                break;

                case 'textAlign':
                ig.system.context.textAlign = value;
                break;

                case 'font':
                ig.system.context.font = value;
                break;
        
            }
        }
    },

    getLinearGradient: function(option) {
        var grd = ig.system.context.createLinearGradient( option.pos.x, option.pos.y, option.pos.x + option.size.x, option.pos.y + option.size.y);

        var colors = option.colors || {0: 'black', 1: 'white'};
        for (var key in colors) {
            var color = colors[key];
            grd.addColorStop( key, color);
        }

        return grd;        
    },
    getRadialGradient: function(option) {
        var grd = ig.system.context.createRadialGradient(option.pos.x, option.pos.y, option.radius, option.pos.x + option.size.x, option.pos.y + option.size.y, option.deep);
        grd.addColorStop( option.start, option.startColor);
        grd.addColorStop( option.end , option.endColor);
        return grd;        
    }

});


});