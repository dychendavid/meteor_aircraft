ig.module(
	'game.entities.plugins.direction'
)
.requires(
	'impact.entity'
)
.defines(function(){


ig.Entity.inject({
	direction: {
		//是否飛行中
		flying: false,
		settings: {

		},
	},
	/**
	 * 改變方向
	 */

	setDirection: function(target, option) {
		var settings = {
			//追蹤目標
			target: null,

			//變換方向的區間
			interval: 0,
			intervalTimer: null,

			//定時器
			timeout: 0,
			timeoutTimer: null,
			
			//追綜速度
			speed: 300,

			//加速度
			accel: 0,

	    	//時間到後的callback
	    	callback: null,

	    	//會不會撞到牆壁
	    	collision: false

		};

		//套用設定
		ig.merge( settings, option);
		this.direction.settings = settings;

		this.direction.settings.target = target;
		this.direction.settings.intervalTimer = new ig.Timer( this.direction.settings.interval);
		this.direction.flying = true;

		//加載記時器
		if ( this.direction.settings.timeout ) {
            this.direction.settings.timeoutTimer = new ig.Timer( this.direction.settings.timeout );    	    
        }
        

        //第一次的追蹤設定方向
        this.setVelocity( target.pos.x + (target.size.x / 2), target.pos.y + (target.size.y / 2), this.direction.settings.speed, this.direction.settings.accel);

        //NOTICE: 之後的方向變換, 在 update 時執行

	},
	setVelocity: function( x, y, speed, accel ) {
		
		var speed_x = speed;
		var accel_x = accel;
		var speed_y = speed;
		var accel_y = accel;

		var dx = this.pos.x - x;
		var dy = this.pos.y - y;

		//NOTICE:: 115 ~ 128 行, 我不知道為什麼要做修正
		var absX = Math.abs(dx);
		var absY = Math.abs(dy);
		var degree = Math.atan2(absY,absX) * 180 / Math.PI;
		
		if (degree < 45) {
			// 0 ~ 44
			speed_y = speed_y * (degree / 45);
			accel_y = accel_y * (degree / 45);
		} else if (degree > 45) {
			// 46 ~ 90
			speed_x = speed_x * ((90 - degree)/45); 
			accel_x = accel_x * ((90 - degree)/45); 
		}


		if (dx > 0) {
			// left
			this.vel.x = -speed_x;
			this.accel.x = -accel_x;
		} else {
			// right
			this.vel.x = speed_x;
			this.accel.x = accel_x;
		}

		if (dy > 0) {
			// up
			this.vel.y = -speed_y;
			this.accel.y = -accel_y;
		} else {
			// down
			this.vel.y = speed_y;
			this.accel.y = accel_y;
		}

	},
	update: function() {
		//每一段時間就要變換一次方向
		if ( this.direction.settings.interval && this.direction.settings.intervalTimer.delta() >= 0) {
			this.setVelocity( this.direction.settings.target.pos.x, this.direction.settings.target.pos.y, this.direction.settings.speed, this.direction.settings.accel);
			this.direction.settings.intervalTimer.reset();
		}

		//只執行一次的定時器
		if ( typeof(this.direction.settings.callback) == 'function' && this.direction.settings.timeout && this.direction.settings.timeoutTimer.delta() >= 0 ) {
	    	this.direction.settings.callback();
	    	this.direction.settings.timeout = 0;
        }
        
        this.parent();	
	},
	
	handleMovementTrace: function (res) {
    	this.pos.x += this.vel.x * ig.system.tick;
		this.pos.y += this.vel.y * ig.system.tick;	


    	if ( !this.direction.flying || this.direction.settings.collision ) {
    		this.parent( res );
		}
	}
	
});

});