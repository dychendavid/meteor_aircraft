ig.module(
    'game.entities.material.aerolite'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityAerolite = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/goblingreen.png', 32, 32 ),        
        target: null,
        size: {
            x: 1,
            y: 1
        },
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim( 'idle', 1, [0] );
        },
        ready: function() {
            //this.setDirection({pos: this.target, size: {x: 1, y:1}});
            //this.target = ig.game.spawnEntity(EntityAeroliteTarget, this.target.x, this.target.y);
            //this.distance = this.distanceTo( this.target );
        },
        update: function() {
             var scale = 1 - (this.distanceTo( {pos:this.target} ) / this.distance);
             if (this.scale >= 1) {
                this.kill();
                return;
             }
             this.parent();
        },


    });


    EntityAeroliteTarget = ig.Entity.extend({
    });
});