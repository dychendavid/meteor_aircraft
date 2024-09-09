ig.module(
	'game.entities.aero_player'
)
.requires(
	    'game.entities.material.aerolite',
	'impact.entity'
)
.defines(function(){

EntityAero_player = ig.Entity.extend({
	size: {x: 32, y:32},
	health:50,
	gravityFactor:0,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.NONE,
	animSheet: new ig.AnimationSheet( 'media/goblingreen.png', 32, 32 ),		
	showHealth: true,
	maxHealth: 50,
	vel: {
    	x: 0,
    	y: 0
	},
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = true;

	},
	ready: function() {
		ig.game.spawnEntity(EntityAerolite, 1, 1, {
			target: {
				x: 150,
				y: 150
			}

		});

	},
	update: function() {
		// move!
		this.parent();
	},
	draw: function() {
		this.parent();
	},
	check: function( other ) {

	}
});

});