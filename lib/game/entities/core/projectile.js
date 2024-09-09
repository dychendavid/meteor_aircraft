ig.module(
	'game.entities.projectile'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityProjectile = ig.Entity.extend({
	size: {x: 8, y: 4},
	maxVel: { x: 700, y: 700 },
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, 
	collides: ig.Entity.COLLIDES.NEVER,

	//gravityFactor : 0,
		
	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),
	
	target : null,
	qs_skill : null,
	speed:100,
	_start_speed: 200,
	_accel_add: 200,
	pathTimer : null,

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.pathTimer = new ig.Timer(2);

		this.qs_skill = settings.skill;
		if (this.qs_skill && this.qs_skill.type == 0) {
			this.animSheet = new ig.AnimationSheet( this.qs_skill.image, this.qs_skill.imgSize.x, this.qs_skill.imgSize.y );
		}

		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;
		
		
		// 未完成
		// TODO 拋射類角度計算

		if (this.qs_skill && this.qs_skill.type == 1) {
			var start_speed_x = this._start_speed;
			var accel_add_x = this._accel_add;
			var start_speed_y = this._start_speed;
			var accel_add_y = this._accel_add;

			var dx = x - settings.target.pos.x;
			var dy = y - settings.target.pos.y;
			var absX = Math.abs(dx);
			var absY = Math.abs(dy);

			var degree = Math.atan2(absY,absX) * 180 / Math.PI;
			
			if (degree < 45) {
				// 0 ~ 44
				start_speed_y = start_speed_y * (degree / 45);
				accel_add_y = accel_add_y * (degree / 45);
			} else if (degree == 45) {
				// 45
			} else {
				// 46 ~ 90
				start_speed_x = start_speed_x * ((90 - degree)/45); 
				accel_add_x = accel_add_x * ((90 - degree)/45); 
			}


			if (dx > 0) {
				// left
				this.vel.x = -start_speed_x;
				this.accel.x = -accel_add_x;
			} else {
				// right
				this.vel.x = start_speed_x;
				this.accel.x = accel_add_x;
			}

			if (dy > 0) {
				// up
				this.vel.y = -start_speed_y;
				this.accel.y = -accel_add_y;
			} else {
				// down
				this.vel.y = start_speed_y;
				this.accel.y = accel_add_y;
			}
		}
		
	},

	update: function() {
		
		// Update it every 0.5 seconds
		if (this.qs_skill && this.qs_skill.type == 0) {
			if(this.pathTimer.delta() > 0) {
				// Get the path to the player

				this.getPath(this.target.pos.x, this.target.pos.y, false, [], []);
				
				this.pathTimer.reset();
				
			}

			// Walk the path
			this.followPath(this.speed, true);

			// Update the animation
			this.currentAnim.gotoFrame(this.headingDirection);
		}

		// Heading direction values
		// 1 4 6
		// 2 0 7
		// 3 5 8
		
		// move!
		this.parent();
	},
	
	draw: function() {
		if(!ig.global.wm) {
			// Draw the path ...
			this.drawPath(255, 0, 0, 0.5);
		}

		this.parent();
	},
	
	handleMovementTrace: function (res) {
		
		var target = this.target;
		if (!target) {
			this.parent(res);
			this.kill();
		}

		var tileSize = ig.game.collisionMap.tilesize;
		// fps 60
		var vx = this.vel.x/60;
		var vy = this.vel.y/60;

		if (this.qs_skill.type == 0) {
			
			// if (res.collision.x) {
			// 	if ((this.pos.x - target.pos.x) > 0) {
			// 		this.pos.x -= (this.vel.x/60);
			// 	} else {
			// 		this.pos.x += (this.vel.x/60);
			// 	}
			// } else if (res.collision.y) {
			// 	if ((this.pos.y - target.pos.y) > 0) {
			// 		this.pos.y -= (this.vel.y/60);
			// 	} else {
			// 		this.pos.y += (this.vel.y/60);
			// 	}
			// } else if (res.collision.slope) {
			// 	if ((this.pos.x - target.pos.x) > 0) {
			// 		this.pos.x -= (this.vel.x/60);
			// 	} else {
			// 		this.pos.x += (this.vel.x/60);
			// 	}

			// 	if ((this.pos.y - target.pos.y) > 0) {
			// 		this.pos.y -= (this.vel.y/60);
			// 	} else {
			// 		this.pos.y += (this.vel.y/60);
			// 	}
			// 	ig.log("x = " + res.collision.x);
			// 	ig.log("y = " + res.collision.y);
			// 	ig.log("slope = " + res.collision.slope);
			// }
			
			this.parent(res);
			
		} else {
			// 遠程 
			//在畫面裏面的碰撞都穿透
			if ((this.pos.x > tileSize  &&  this.pos.x < (ig.system.realWidth - tileSize))
			&& (this.pos.y > tileSize && this.pos.y < (ig.system.realHeight - tileSize))) {
				//this.pos.x += vx;
				//this.pos.y += vy;
				this.pos.x += this.vel.x * ig.system.tick;
    			this.pos.y += this.vel.y * ig.system.tick;
			} else {
				// add this.parent(res); 還是會發生碰撞
				this.parent(res);
				if (res.collision.x || res.collision.y) {
					this.kill();
				}

				if (res.collision.slope) {
					this.kill();
				}
			}
		}
	},
	
	check : function (other) {
		other.receiveDamage(10);
		this.kill();
    },
});

});