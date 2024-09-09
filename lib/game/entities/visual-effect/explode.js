ig.module(
	'game.entities.visual-effect.explode'
)
.requires(
	'impact.entity',
	'game.entities.core.visual-effect'
)
.defines(function(){


EntityExplode = EntityVisualEffect.extend({
	duration: 3,
    animSheet: new ig.AnimationSheet( 'media/GBfire-effect01.png', 48, 48 ),
	init: function(x, y, settings) {
	    
	    if ( settings.duration ) {
    		this.duration = settings.duration;    
	    }
	    
	    if ( settings.target) {
    	    this.target = settings.target;
	    }
	    this.durationTimer = new ig.Timer(this.duration);
	    
	    this.addAnim( 'hurting', 0.1, [0, 1, 2, 3, 4] );	
	    
	    this.parent(x, y, settings);
	},	
	update: function() {
    	if ( this.duration && this.durationTimer.delta() >= 0 ) {
        	this.kill();
    	}
    	
    	if ( this.target ) {
    	   this.pos.x = this.target.pos.x;
    	   this.pos.y = this.target.pos.y;
    	}
    	
    	this.parent();
	}
});

});