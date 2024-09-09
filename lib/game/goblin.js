ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'plugins.fade-control',
	'plugins.empika.entity_utilities',
	'plugins.empika.game_utilities',
	'plugins.context-extend',

	'game.levels.gablin_prototype_002'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gravity:100,
	
	init: function() {

		// Initialize your game here; bind keys etc.
		this.loadLevel( LevelGablin_prototype_002 );
        ig.input.initMouse();
        ig.input.bind( ig.KEY.MOUSE1, 'lbtn' );
        

	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
		
		this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 750, 480, 1 );

});
