ig.module(
	'plugins.moveTo'
)
.requires(
	'impact.entity'
)
.defines(function(){


ig.Entity.inject({
	getCenterPos: function( entity ) {
		entity = entity || this;

		return {
			x: entity.pos.x + (entity.size.x / 2),
			y: entity.pos.y + (entity.size.y / 2)
		}
	},
	moveTo: function(x, y, speed, accel) {
		var speed_x = speed;
		var accel_x = accel;
		var speed_y = speed;
		var accel_y = accel;

		var dx = this.getCenterPos(this).x -  x;
		var dy = this.getCenterPos(this).y -  y;

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

	}
});


ig.Entity.inject({
	_tracer: {
		//是否追蹤中(not configuable)
		tracing: false,

		//區間計時器(not configubale)
		timer: null,

		//是否要撞到牆壁
		collision: false,

		//追蹤目標
		target: null,

		//改變方向的時間間隔
		interval: 0.1,

		//追蹤速度
		speed: 100,

		//追蹤加速度
		accel: 0,

	},
	traceTo: function(other, option) {
		ig.merge( this._tracer, option);

		this._tracer.target = other;
		this._tracer.tracing = true;
		this._tracer.timer = new ig.Timer( this._tracer.interval );

        //第一次的追蹤設定方向
		this.moveTo(this.getCenterPos( this._tracer.target).x, this.getCenterPos(this._tracer.target).y, this._tracer.speed, this._tracer.accel);

        //NOTICE: 之後的方向變換, 在 update 時執行
	},
	traceStop: function() {
		this._tracer.target = null;
		this._tracer.tracing = false;
	},
	update: function() {
		//每一段時間就要變換一次方向
		if ( this._tracer.tracing && this._tracer.timer.delta() >= 0) {
			this.moveTo(this.getCenterPos( this._tracer.target ).x, this.getCenterPos(this._tracer.target).y, this._tracer.speed, this._tracer.accel);
			this._tracer.timer.reset();
		}
        
        this.parent();	
	},
	handleMovementTrace: function (res) {
    	if ( !this._tracer.tracing || this._tracer.collision ) {
    		this.parent( res );
    		return;
		}

    	this.pos.x += this.vel.x * ig.system.tick;
		this.pos.y += this.vel.y * ig.system.tick;	
	}
	
});


});

