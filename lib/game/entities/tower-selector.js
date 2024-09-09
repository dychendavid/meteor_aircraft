ig.module(
	'game.entities.tower-selector'
)
.requires(
	//requrire all tower
	'game.entities.player',


	'impact.entity'

)
.defines(function(){



EntityTowerSelector = ig.Entity.extend({
	size: {x: 100, y:20},
	
	type: ig.Entity.TYPE.A,
	itemSize: {x: 32, y:32},
	itemGap: 0,
	init: function( x, y, settings ) {
        console.log('selecor init');
		this.parent( x, y, settings );
	},
	
	ready: function() {
	    console.log('selector ready');
		this.parent();
		
		//load tower list
		var json = [
			{
    			entity: 'EntityPlayer',
    			animSheet: 'media/goblingreen.png',
    			animSize: {x: 32, y:32}
			},
			{
    			entity: 'EntityEnemyGoblin',
    			animSheet: 'media/goblinred.png',
    			animSize: {x: 32, y:32}
			}

		];

		
		//generate selector item
		var offsetX = 0;
		for(var index in json) {
    		var row = json[index];

    		if ( !row.entity ) {
        		continue;
    		}

    		//prepare data
    		for(var key in row) {
        		if ( key == 'animSheet') {
    		      row[key] = new ig.AnimationSheet( row[key], row.animSize.x, row.animSize.y );
        		}
    		}

    		row.size = this.itemSize;

    		if ( index != 0 ) {
        		offsetX += this.itemSize.x + this.itemGap;
    		}

    		//go 
			ig.game.spawnEntity( EntityTowerSelectorItem, this.pos.x + offsetX, this.pos.y, row);
			
		}

	},

});


EntityTowerSelectorItem = ig.Entity.extend({
	type: ig.Entity.TYPE.A,

	init: function( x, y, settings ) {
    	console.log('item init');

		//apply setting
		for( var key in settings) {
    		this[key] =  settings[key];
		}

		// Add the animations
		this.addAnim( 'idle', 1, [0] );

		this.parent(x, y, settings);		
	},

	update: function() {
		this.parent();
	},
	draw: function() {
        this.parent();	
	},
	clicked: function(pointer) {
	    eval('pointer.selectedTower = ' + this.entity);
    	console.log('tower selected:' + this.entity);
	}
});



});