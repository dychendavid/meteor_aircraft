ig.module(
    'game.entities.plugins.pow'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityPow = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/pow.png', 40, 21 ),
    gravityFactor: 0,
    fadetime: 0.5,
    lifetime: 0.5,
    init: function(x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim( 'moving', 1, [0] ); 

        this.idleTimer = new ig.Timer();
    },
    update : function () {
        if (this.idleTimer.delta() > this.lifetime) {
            this.kill();
            return;
        }

        //fade out
        this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);

        this.parent();
    }

});

});