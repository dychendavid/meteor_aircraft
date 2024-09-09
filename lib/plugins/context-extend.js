ig.module(
	'plugins.context-extend'
)
.requires(
	'impact.impact',
	'impact.system'
)
.defines(function(){

ig.ContextTools = ig.Class.extend({
    drawFillText: function(option) {
        var alpha = option.alpha || ig.system.context.globalAlpha;
        var font = option.font || ig.system.context.font;
        var textAlign = option.textAlign || ig.system.context.textAlign;

        ig.system.context.save();
        ig.system.context.textAlign = textAlign;
        ig.system.context.globalAlpha = alpha;
        ig.system.context.font = font;
        ig.system.context.fillStyle = option.color;
        ig.system.context.fillText( option.text, option.x, option.y);
        ig.system.context.restore();
        
    },
    drawStrokeText: function(option) {
        var alpha = option.alpha || ig.system.context.globalAlpha;
        var font = option.font || ig.system.context.font;
        var lineWidth = option.lineWidth || ig.system.context.lineWidth;
        var textAlign = option.textAlign || ig.system.context.textAlign;

        ig.system.context.save();
        ig.system.context.textAlign = textAlign;
        ig.system.context.lineWidth = lineWidth;
        ig.system.context.globalAlpha = alpha;
        ig.system.context.font = font;
        ig.system.context.strokeStyle = option.color;
        ig.system.context.strokeText( option.text, option.x, option.y);
        ig.system.context.restore();
        
    },
    drawFillCircle: function(option) {
        var alpha = option.alpha || ig.system.context.globalAlpha;

        ig.system.context.save();
        ig.system.context.globalAlpha = alpha;
        ig.system.context.beginPath();
        ig.system.context.arc(option.centerX, option.centerY, option.radius, 0, 2 * Math.PI, false);
        ig.system.context.fillStyle = option.color;
        ig.system.context.fill();
        ig.system.context.restore();
    },
    drawStrokeCircle: function(option) {
        var alpha = option.alpha || ig.system.context.globalAlpha;
        var lineWidth = option.lineWidth || ig.system.context.lineWidth;
        
        ig.system.context.save();
        ig.system.context.lineWidth = lineWidth;
        ig.system.context.globalAlpha = alpha;
        ig.system.context.beginPath();
        ig.system.context.arc(option.centerX, option.centerY, option.radius, 0, 2 * Math.PI, false);
        ig.system.context.strokeStyle = option.color;
        ig.system.context.stroke();
        ig.system.context.restore();
    },
        drawFillRect: function(option) {
        var alpha = option.alpha || ig.system.context.globalAlpha;

        ig.system.context.save();
        ig.system.context.globalAlpha = alpha;
        ig.system.context.fillStyle = option.color;
        ig.system.context.fillRect( option.x, option.y, option.width, option.height);
        ig.system.context.restore();
    },
    drawStrokeRect: function(option){
        var alpha = option.alpha || ig.system.context.globalAlpha;
        var lineWidth = option.lineWidth || ig.system.context.lineWidth;

        ig.system.context.save();
        ig.system.context.globalAlpha = option.alpha;
        ig.system.context.strokeStyle = option.color;
        ig.system.context.lineWidth   = option.lineWidth;
        ig.system.context.strokeRect(option.x, option.y, option.width, option.height);
        ig.system.context.restore();
    },
    drawFillRectCorner: function(option)
    {
        var alpha = option.alpha || ig.system.context.globalAlpha;
    
        ig.system.context.save();
        ig.system.context.globalAlpha = alpha;
        ig.system.context.fillStyle = option.color;

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
        ig.system.context.restore();

    },
    drawStrokeRectCorner: function(option)
    {
        var alpha = option.alpha || ig.system.context.globalAlpha;
        var lineWidth = option.lineWidth || ig.system.context.lineWidth;
    
        ig.system.context.save();
        ig.system.context.globalAlpha = alpha;
        ig.system.context.lineWidth = lineWidth;

        ig.system.context.strokeStyle = option.color;
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
        ig.system.context.restore();
    }
});


});