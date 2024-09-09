ig.module(
	'game.entities.enemy'
)
.requires(

    'game.entities.material.death-explosion',
    'plugins.painter',
	'impact.entity'

)
.defines(function(){

EntityEnemy = ig.Entity.extend({
	health:100,
	maxHealth: 100,

	size: {x: 180, y:260},
	offset: {
    	x: 100,
    	y: 120,
	},
	size: {x: 100, y: 120},
	offset: {
		x: 60,
		y: 80
	},
	gravityFactor:0,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ACTIVE,
	animSheet: new ig.AnimationSheet( 'media/beholder1.png', 200, 209 ),		
	vel: {
    	x: 0,
    	y: 0
	},
	maxVel: {
		x: 1000,
		y: 1000
	},

	//變成 boss 時的血量
	bossHealth: 500,

	//變換方向的時間
	movetime: 1,

	attacktime: 1,

	//裝甲防禦聲音
	armorSound: new ig.Sound('media/sound/glass-hitbreak15.ogg'),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );

		this.movetimer = new ig.Timer( this.movetime);

		this.attacktimer = new ig.Timer( this.attacktime );

	},
	ready: function() {
		//慢動作監測器
		ig.game.spawnEntity(EntitySlowTrigger, this.pos.x, this.pos.y, {
			target: this
		});
	},
	
	update: function() {

		if ( this.movetimer.delta() >= 0 ) {

			this.vel.x = (Math.random() * 2 - 1) * 200;
			this.vel.y = (Math.random() * 2 - 1) * 200;
			
			this.currentAnim.flip.x = this.vel.x > 0;
			
			this.movetimer.reset();
		}



		if (this.attacktimer.delta() >= 0 ) {
			this.attacktimer.reset();
		}



		// move!
		this.parent();

		//顯示裝甲
		if ( this.showArmor && this.armortimer.delta() >= 0 ) {
			this.armortimer.reset();
			this.armortimer.pause();
			this.showArmor = false;
		}


		//顯示受傷
		if ( this.showHurt && this.hurttimer.delta() >= 0 ) {
			this.hurttimer.reset();
			this.hurttimer.pause();
			this.showHurt = false;
		}



		//BOSS 模式, 變身中, 會自己補滿血
		if ( this.becomingBoss && this.becomeTimer.delta() >= 0) {

			this.vel.x = 0;
			this.vel.y = 0;

			//補滿血
			if ( this.health < this.bossHealth) {
				this.health++;
			}
			else {
				this.becomingBoss = false;
			}
		}
	},
	draw: function() {
		var percent = this.health / this.maxHealth ;


		var painter = new ig.Painter;
/*
		//畫 debug 外框
		painter.drawStrokeRect({
		  x: this.pos.x,
		  y: this.pos.y,
		  width: this.size.x,
		  height: this.size.y,
		  color: 'white',
		  lineWidth: 2,
		});
*/

		//血量顏色
		if (percent > 0.7 ) {
			color = '#5CC433';
		}
		else if ( percent > 0.4) {
			color = '#876B0E';
		}
		else {
			color = '#FF1717';
		}

		var gradient = {
				colors: {
					'0': '#333',
					'1': color,
				},
				pos: {
					x: this.pos.x,
					y: this.pos.y - 2,
				},
				size: {
					x: 180,
					y: 10,
				},
				radius: 100,
				deep: 70,
			}
		color = painter.getLinearGradient(gradient);



		if ( this.becomingBoss ) {
			border = '#16E8F7';
			borderWidth =  3;
		}
		else {
			border = 'white';
			borderWidth = 1;
		}


		//受傷模式
		if ( this.showHurt ) {
			border = this.hurtColor;
			borderWidth = 3;
		}		


		//畫外框
        painter.drawStrokeRect({
            x: this.pos.x - 30,
            width: 180 ,
            y: this.pos.y  - 50,
            height: 13,
            color: border,
            lineWidth: borderWidth
        });

        //畫底色
        painter.drawFillRect({
            x: this.pos.x - 30,
            width: 180 ,
            y: this.pos.y  - 50,
            height: 13,
            color: 'black'
        });
        
        //畫當前血量
        painter.drawFillRect({
            x: this.pos.x - 30,
            width: 180 * ( this.health / this.maxHealth ),
            y: this.pos.y  - 50,
            height: 13 ,
            color: color,
        });

		//顯示裝甲
		if ( this.showArmor ) {

	        painter.drawFillCircle({
	            centerX: this.pos.x + this.size.x / 2,
	            centerY: this.pos.y + this.size.y / 2,
	            radius: 65,
	            color: this.armorColor,
	            alpha: 0.8

	        });
	        
	        painter.drawStrokeCircle({
	            centerX: this.pos.x + this.size.x / 2 ,
	            centerY: this.pos.y + this.size.y / 2,
	            radius: 65,
	            color: 'white',
	            lineWidth: 5,
	            alpha: 0.5,
	        });

		}

        this.parent();
   	},
	receiveDamage: function(damage, other) {
		//在變身模式下, 有裝甲時間
		if ( this.becomingBoss) {
			this.armorMode(0.5, '#7B8A5C');
			return;
		}

		this.hurtMode(0.1, 'red');


		if ( this.health - damage <= 0 ) {
			particles = 25;
			radius = {
				max: 6,
				min: 1,
			}
		}
		else if ( damage == 10) {
			var particles = 2;
			var radius = {
				max: 4,
				min: 1
			}
		}

		if ( particles ) {
        	ig.game.spawnEntity( EntityDeathExplosion, this.pos.x + this.size.x/2 - 10 , this.pos.y  + this.size.y / 2 + 30, {
            	particles: particles,
            	radius: radius,
            	lifetime: 0.2,
            	particleSettings: {
    	    		innerColor: '#962018',
    	    		outterColor: '#992E2E',
            		friction: {
            			x: 0,
            			y: 0
            		},
            		vel: {
                		x: 70,
                		y: 60
            		},
            		lifetime: 1.3,
            	}
        	   
        	});    	
    	}

    	this.parent(damage);
	},
	kill: function() {
		//死亡時, 要將遊戲速度調回正常
		ig.game.normalMotion();
		this.parent();
	},
	//變身成 boss
	iamboss: function() {
		this.becomingBoss = true;
		this.becomeTimer = new ig.Timer(0.5);
		this.maxHealth = this.bossHealth;

	},

	//顯示裝甲
	armorMode: function(time, color) {
		this.showArmor = true;
		this.armortimer = new ig.Timer(time);
		this.armorColor = color;
		this.armorSound.play();
	},
	//顯示裝甲
	hurtMode: function(time, color) {
		this.showHurt = true;
		this.hurttimer = new ig.Timer(time);
		this.hurtColor = color;
//		this.hurtSound.play();
	},

	check: function(other) {
		if ( other instanceof EntityPlayer) {
			other.kill();
		}

		//裝甲模式下, 要彈回其他人的攻擊
		if ( this.showArmor && other instanceof EntityTraceLaserBeam) {
			other.collides = ig.Entity.COLLIDES.LITE;
		}
	}

});



EntitySlowTrigger = ig.Entity.extend({
	size: {
		x: 300,
		y: 300
	},
	target: null,
	checkAgainst: ig.Entity.TYPE.A,
	enemys: [],

	threshold: 15,
	update: function() {
		//偵測週圍目前有多少敵人
		for( var i = 0; i < this.enemys.length; i++) {
			a = this.touches( this.enemys[i]);
			if ( !a ) {
				this.enemys.erase( this.enemys[i]);

			}
		}

		//週遭沒有危險
		if ( this.enemys.length == 0 ){ 
			ig.game.normalMotion();
		}


		//boss 死亡時, 已不需要慢動作
		if (this.target && this.target._killed) {
			ig.game.normalMotion();
			this.kill();
		}


		//監測區要跟著 boss 跑
		this.pos = {
			x: this.target.pos.x +  (this.target.size.x / 2) - this.size.x / 2,
			y: this.target.pos.y +  (this.target.size.y / 2) - this.size.y / 2
		}

		this.parent();
	},
	check: function(other) {

		//只需要判斷雷射槍才是威脅
		if ( !(other instanceof EntityLaserBeam)) {
			return;
		}

		var chk = true;
		for(var i = 0; i < this.enemys.length; i++) {
			if ( other == this.enemys[i]) {
				chk = false;
			}
		}

		if ( chk) {
			this.enemys.push( other);
		}
		if ( this.target.health <= this.threshold) {
			ig.game.slowMotion();
		}
	},
	draw1: function() {

		var painter = new ig.Painter;
        painter.drawStrokeRect({
            x: this.pos.x,
            width: this.size.x ,
            y: this.pos.y,
            height: this.size.y,
			color: '#fff'
        });
 
	},

});
});