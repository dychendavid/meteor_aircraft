ig.module(
	'game.entities.plugins.anims-applyer'
)
.requires(
	'impact.entity'
)
.defines(function(){


ig.Entity.inject({
    init: function(x, y, settings) {
        this.parent(x, y, settings);

        if( this.animSheet ) {
            for( var name in this.animations) {
                var anim = this.animations[name];
                if ( anim.interval && anim.frames ) {
    	            this.addAnim( name, anim.interval, anim.frames );
    	        }
            }
        }
    }
});

});