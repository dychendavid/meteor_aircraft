ig.module(
	'game.entities.painterdemo'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityPainterdemo = ig.Entity.extend({
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
	scalable: true,
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},
	draw: function() {
		var painter = new ig.Painter;
		painter.drawFillCircle({
			color: 'gray',
			radius: 30,
			centerX: ig.system.width / 2,
			centerY: ig.system.height / 2,
			alpha: 0.6
		});

		painter.drawStrokeCircle({
			color: 'green',
			radius: 30,
			centerX: ig.system.width / 2 + 30,
			centerY: ig.system.height / 2,
			lineWidth: 10,
			alpha: 0.4
		});


		painter.drawFillRect({
			color: 'blue',
			x: ig.system.width / 2 + 80,
			y: ig.system.height / 2 - 60,
			width: 30,
			height: 150,
			alpha: 0.5
		});

		painter.drawStrokeRect({
			color: 'pink',
			x: ig.system.width / 2 - 50,
			y: ig.system.height / 2 + 50,
			width: 150,
			height: 30,
			lineWidth: 7,
			alpha: 0.4
		});

		painter.drawStrokeRectCorner({
			color: 'yellow',
			x: ig.system.width / 2 - 100,
			y: ig.system.height / 2 - 100,
			width: 150,
			height: 60,
			radius: 30,
			lineWidth: 11,
			alpha: 0.5
		});

		painter.drawFillRectCorner({
			color: 'purple',
			x: ig.system.width / 2 - 100,
			y: ig.system.height / 2 - 100,
			width: 60,
			height: 120,
			radius: 10,
			alpha: 0.5,
		});

		painter.drawFillText({
			color: '#069589',
			font: 'italic 40pt Verdana',
			text: 'Quasar',
			x: 100,
			y: 100,
			alpha: 1

		});

		painter.drawStrokeText({
			color: '#00ffff',
			font: 'italic 40pt Lucida Console',
			text: 'Flame',
			x: 200,
			y: 150,
			alpha: 1

		});


		painter.drawFillText({
			color: '#ffffff',
			font: 'italic 40pt Calibri',
			text: 'Painter',
			x: 300,
			y: 300,
			alpha: 1

		});

		painter.drawStrokeText({
			color: '#0000ff',
			font: 'italic 40pt Calibri',
			text: 'Demo',
			x: 300,
			y: 300,
			alpha: 1,
			lineWidth: 2,
			textAlign:'right'

		});

		this.parent();
	},
});


});