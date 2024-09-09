ig.module(
	'game.entities.core.skill-projectile'
)
.requires(
	'game.entities.core.skill',
	'impact.entity'
)
.defines(function(){


EntitySkillProjectile = EntitySkill.extend({
	size: {x: 8, y: 4},
	maxVel: { x: 700, y: 700 },
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, 
	collides: ig.Entity.COLLIDES.NEVER,
		
	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),
	
	target : null,
	qsSkill : null,
	_start_speed: 200,
	_accel_add: 200,

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.qsSkill = settings.qsSkill;
		this.target = settings.target;

		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;
		
		
		// 未完成
		// TODO 拋射類角度計算

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

	},
	
	check : function (other) {
		other.receiveDamage(10);
		this.kill();
    },
});

});