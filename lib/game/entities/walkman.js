ig.module(
	'game.entities.walkman'
)
.requires(
	'game.entities.core.character',
	'game.entities.skill.fireball',
	'game.entities.skill.bullet',

	'impact.entity'
)
.defines(function(){

EntityWalkman = EntityCharacter.extend({
	size: {x: 48, y:48},
	health:50,
	
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet( 'media/walktest.png', 48, 48 ),		
	vel: {x: -50, y:0},
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 0.05, [0, 1, 2, 3, 4, 5] );
		this.currentAnim.flip.x = false;

		//for test, 3 is attack cd.
		this.attack = new ig.Timer(3);
	},
	
	update: function() {

		//for test
		if ( this.attack.delta() >= 0 ) {
//			ig.game.spawnEntity(EntityBullet, this.pos.x - 50, this.pos.y);
			this.currentAnim.flip.x = !this.currentAnim.flip.x;
			this.vel.x *= -1;
			this.attack.reset();
		}
		// move!
		this.parent();
	},
	draw: function() {
		this.drawBorder('#fff', 2);
		this.parent();
	}
});

});