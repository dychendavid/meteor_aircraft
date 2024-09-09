ig.module(
	'game.entities.player'
)
.requires(
	'game.entities.material.laser',
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	size: {x: 76, y:70},
	health:50,
	maxHealth: 50,
	type: ig.Entity.TYPE.A,
	animSheet: new ig.AnimationSheet( 'media/fly.png', 76, 70 ),		

	
	//死亡時的音效
	killSound: new ig.Sound('media/sound/explode.ogg'),

	//追蹤雷射的 CD 時間
	traceCooldown: 1,
	tracetimer: null,

	//普攻的 CD 時間
	normalCooldown: 0.1,
	normaltimer: null,

	//基礎移動速率
	baseMove: 200,

	//渦輪引擎數(not cnofiguable)
	turbos : [],


	init: function( x, y, settings ) {

		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );

		//laser 的計時器
		this.tracetimer = new ig.Timer(this.traceCooldown);

		//普攻的計時器
		this.normaltimer = new ig.Timer( this.normalCooldown);

		this.killSound.volume = 0.3;

	},
	ready: function() {

		//裝備主推進器
		var t = ig.game.spawnEntity( EntityEquipLaserBeam, this.pos.x + (this.size.x / 2) - 5, this.pos.y + (this.size.y/2) + 30, {
            target: this,
            offset: {
                x: -5,
                y: 30,
            },
            dataSize: 4,
            segments: 2,
            checkAgainst: ig.Entity.TYPE.NONE,
            innerColor: '#FFB64F',
            laserSize: 10
            
		});
		this.turbos.push(t);

		//裝備左1渦輪
		var t = ig.game.spawnEntity( EntityEquipLaserBeam, this.pos.x, this.pos.y, {
            target: this,
            offset: {
                x: -21,
                y: 30,
            },
            dataSize: 2,
            segments: 2,
            checkAgainst: ig.Entity.TYPE.NONE,
            innerColor: '#F2B968',
            laserSize: 3
            
		});
		this.turbos.push(t);

		//裝備右1渦輪
		var t = ig.game.spawnEntity( EntityEquipLaserBeam, this.pos.x, this.pos.y, {
            target: this,
            offset: {
                x: 15,
                y: 30,
            },
            dataSize: 2,
            segments: 2,
            checkAgainst: ig.Entity.TYPE.NONE,
            innerColor: '#F2B968',
            laserSize: 3
            
		});
		this.turbos.push(t);


		//裝備左2渦輪
		var t = ig.game.spawnEntity( EntityEquipLaserBeam, this.pos.x, this.pos.y, {
            target: this,
            offset: {
                x: -35,
                y: 30,
            },
            dataSize: 2,
            segments: 2,
            checkAgainst: ig.Entity.TYPE.NONE,
            innerColor: '#F2B968',
            laserSize: 3
            
		});
		this.turbos.push(t);

		//裝備右2渦輪
		var t = ig.game.spawnEntity( EntityEquipLaserBeam, this.pos.x, this.pos.y, {
            target: this,
            offset: {
                x: 25,
                y: 30,
            },
            dataSize: 2,
            segments: 2,
            checkAgainst: ig.Entity.TYPE.NONE,
            innerColor: '#F2B968',
            laserSize: 3
            
		});
		this.turbos.push(t);


	},
	update: function() {

		//渦輪的火燄要變色
        for(var i = 0; i < this.turbos.length; i++) {
            if ( ig.input.state('turbo')) {
                this.turbos[i].innerColor = '#fff';
                this.turbos[i].outterColor = '#00FFE5';

                if ( i > 0) {
                    this.turbos[i].showLaser = true;
                }
            }
            else {
                this.turbos[i].innerColor = '#F2B968';
                this.turbos[i].outterColor = '#f00';
                
                if ( i > 0) {
                    this.turbos[i].showLaser = false;
                }
                
            }
		}


		//基礎速率
		var bm = this.baseMove;

		//開加速度控制
		if ( ig.input.state('turbo') ) {
    		 bm *= 3;
		}

		//重設速限
		this.maxVel = {
			x: bm,
			y: bm
		};


		//方向控制
		if ( ig.input.state('up') ) {
			this.vel.y = bm * -1;
		}
		if ( ig.input.state('down') ) {
			this.vel.y = bm;
		}

		if (ig.input.released('up') || ig.input.released('down')) {
			this.vel.y = 0;
		}


		if ( ig.input.state('left') ) {
			this.vel.x = bm * -1;
		}
		if ( ig.input.state('right') ) {
			this.vel.x = bm;
		}

		if (ig.input.released('left') || ig.input.released('right')) {
			this.vel.x = 0;
		}


        //為了不讓集氣表破表, 所以滿了要暫停
		if (this.tracetimer.delta() >= 0 ) {
			this.tracetimer.pause();
		}


        //發射 laser
		if ( this.tracetimer.delta() >= 0 && ig.input.pressed('laser')) {
				if ( ig.game.boss._killed ) {
					var target = null;
				}
				else {
					var target = ig.game.boss;
				}

				var me = ig.game.spawnEntity( EntityExplosion, this.pos.x + (this.size.x / 2), this.pos.y + this.size.y / 2 + 30, {
					particleType: 'EntityTraceLaserBeam',
					particles: 4,
					explodeVel: {
						x: 300,
						y: 300,
					},
					lifetime: 1,
					particleSettings: { 
    					target: target,

    					//雷射都在自己的機身下
    					zIndex: this.zIndex - 1,
						attack: 10,
						speed: 800,
						segments: 5,
						type: ig.Entity.TYPE.A,
						checkAgainst: ig.Entity.TYPE.B,
						activeSound: new ig.Sound('media/sound/missile.ogg'),
						activeVolume: 0.1,
						//因為 z 軸有改變, 所以要重新 sort
						initCallback: function() {
					    	ig.game.sortEntities();
						}
					},
				});

		        this.tracetimer.reset();

		}

		//普攻的 cd 時間
		if ( this.normaltimer.delta() >= 0 && ig.input.pressed('attack') ) {
			var set = {
				zIndex: this.zIndex - 1,
				maxVel: {
					x: 1000,
					y: 1000,
				},
				vel: {
					x: 0,
					y: -450
				},
				type: ig.Entity.TYPE.A,
				segments: 1,
				dataSize: 2,
				outterColor: 'yellow',
				laserSize: 5,
				prekilltime: 1,
				attack: 2,
				initSound: new ig.Sound('media/sound/laser-02.ogg'),
				initSoundVolume: 0.1,
				checkAgainst: ig.Entity.TYPE.B,
			};

			var lb = ig.game.spawnEntity( EntityLaserBeam, this.pos.x + (this.size.x / 2) - 12, this.pos.y + this.size.y / 2 - 40, set );
			var rb = ig.game.spawnEntity( EntityLaserBeam, this.pos.x + (this.size.x / 2) + 3, this.pos.y + this.size.y / 2 - 40, set );

			this.normaltimer.reset();
		}

	    this.parent();
	},
	draw:function() {

		//集滿氣做亮度顯示
		if ( this.tracetimer.delta() >= 0) {
			var color = '#fff';
		}
		else {
			var color = '#000';
		}

		//集氣表
		var painter = new ig.Painter();
		painter.drawFillRect({
			x: this.pos.x,
			y: this.pos.y - 10,
			width: this.size.x,
			height: 6,
			color: color,
			alpha: 0.5
		});


		var option = {
			x: this.pos.x + 1,
			y: this.pos.y - 9,
			width: (this.tracetimer.delta()  + this.traceCooldown) * (this.size.x - 1) / this.traceCooldown, 
			height: 4,
			alpha: 1,
			gradient : {
				colors: {
					'0': '#1B87E0',
					'1': '#1BE049',
				},
				pos: {
					x: this.pos.x + 1,
					y: this.pos.y - 9,
				},
				size: {
					x: 100,
					y: 0,
				},
				radius: 100,
				deep: 70,
			}
		};
		option.color = painter.getLinearGradient(option.gradient);

		painter.drawFillRect(option);

		this.parent();
	},
	kill:function() {
		//死掉的時候, 渦淪引擎也要銷毀
		 for(var i = 0; i < this.turbos.length; i++) {
            this.turbos[i].kill();
		}
		this.killSound.play();

		this.parent();
	}

});


});