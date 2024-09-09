ig.module(
	'game.entities.core.skill'
)
.requires(
	'plugins.context-extend',
	'impact.entity'
)
.defines(function(){

EntitySkill = ig.Entity.extend({
    drawBorder: function(strokeStyle, LineWidth) {
        var ct = new ig.ContextTools();
        ct.drawContextStrokeRect(strokeStyle, LineWidth, ig.system.getDrawPos(this.pos.x), ig.system.getDrawPos(this.pos.y), ig.system.getDrawPos(this.size.x), ig.system.getDrawPos(this.size.y));
    }

    
    
});


EntitySkill.inject({
    draw: function() {
       // this.drawBorder('#fff', 1);
        this.parent();
    }
});

});
