ig.module(
	'game.entities.material.laser'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityLaserBeam = ig.Entity.extend({
	//外圍顏色
	outterColor: '#f00',

	//內層顏色
	innerColor: '#fff',

	//雷射實體大小(實體在雷射光束的前端)
	size: {
		x: 5,
		y: 5,
	},

	//NOTICE: 存活時間, 為了怕雷射都沒被碰到, 無法觸發消滅, 記憶體會越吃越多, 所以要設定消滅時間, 消滅是 prekill 不是 kill
	//prekill 是 "準備死亡" 的意思,  即進入真正 kill 前的狀態
	lifetime: 4,

	//雷射的粗細
	laserSize: 5,

	//軌跡長度(即資料量, 數字越大, 表示可以殘留的軌跡越長)
	dataSize: 20,
	
	//雷射精細度; 要分成幾段線條(將自動計算每個資料點該差距多少), 數字越大會有越圓弧的線條, 但效能相對會低
	segments:10,

	//紀錄資料結點的時間間隔, 數值越大,則每個節點的間距越長
	//NOTICE: 通常不需要特別調整, 但是為了配合 slowMotion 可以有正常的表現, 因此仍然需要一個計時器
	dataInterval: 0.01,

	//速度的預設值, 軌跡長度會被速率所影響
	vel: {
		x: 100,
		y: 0
	},

	//攻擊力, 預設為 check 時對 other 造成傷害
	attack: 1,

	//初始化音效
	initSound: null,

	//初始化音效音量
	initSoundVolume: 1,
	/////////////////////
	// not configuable //
	/////////////////////
	//經計算後, 每個資料點的間隔(被 segments 跟 dataSize 影響)
	step: 0,

	//一般情況下, 武器類型不應該受重力影響
	gravityFactor:0,

	//存放每個節點的座標
	data: new Array(),

	//是否已進入自我消滅狀態
	prekilling: false,

	//計時器, 用來記算是否該進入 prekill 狀態
	lifetimer: null,

	//資料節點記錄的計時器
	datatimer: null,

	//取得中心座標
	getCenterPos: function(entity) {
		entity = entity || this;
		return {
			x:entity.pos.x + (entity.size.x / 2),
			y:entity.pos.y + (entity.size.y / 2),
		};
	},

	init: function(x, y, settings) {
    	this.parent(x, y, settings);

    	//計算在 draw 時, 每個資料節點中間需要經過幾個節點
		this.step = Math.floor( this.dataSize/ this.segments);
	
		this.lifetimer = new ig.Timer( this.lifetime);
	
		this.datatimer = new ig.Timer( this.dataInterval);

		this.lastPos = this.getCenterPos();

		if ( this.initSound) {
			this.initSound.volume = this.initSoundVolume;
			this.initSound.play();
		}

		this.initCallback && this.initCallback();
	},
	update: function() {
    	//記住軌跡
    	if ( this.datatimer.delta() >= 0 ) {
			this.data.unshift(this.lastPos);
		    this.lastPos = this.getCenterPos();
		}

	    if ( !this.prekilling ) {    		
    		//開始斷掉後面的軌跡, 避免留太長
    		if ( this.data.length > this.dataSize ) {
    			this.data.pop();
    		}
		}
		else {

			//開始清空軌跡, 用 2 倍快的速度消失
		  	this.data.pop();
		  	this.data.pop();

    		if ( this.data.length == 0 ) {
        		this.kill();
        		return;
    		}
		}

		//避免佔掉多餘的記憶體, 回收裝置
		if ( this.lifetime && this.lifetimer.delta() >= 0 ) {
    		this.prekill();
		}
			
		this.parent();
	},
	draw: function() {

		var ctx = ig.system.context;
		ctx.save();
		ctx.beginPath();
	    ctx.lineCap = "round";
	    ctx.lineJoin = "miter";


	    if ( this.prekilling) {
	    	//準備消滅後, 軌跡不再更新, 所以不畫最新的自己的位置, 只畫歷史紀錄
	    	ctx.moveTo( this.data[0].x, this.data[0].y);
	    }
	    else {
	    	//移動中, 仍然持續紀錄自己
		    var centerPos = this.getCenterPos();
			ctx.moveTo( centerPos.x, centerPos.y );
		}

		for( var i = this.step - 1; i < this.data.length; i += this.step )  {

			ctx.lineTo(this.data[i].x, this.data[i].y);

			//畫外圈
            ig.system.context.globalAlpha =  1 - (i / this.data.length);
		    ctx.strokeStyle = this.outterColor;
			ctx.lineWidth = this.laserSize;
			ctx.stroke();

			//畫內層
            ig.system.context.globalAlpha =  1;			
		    ctx.strokeStyle = this.innerColor;
			ctx.lineWidth = this.laserSize / 2;
			ctx.stroke();
		}
		ctx.restore();

		this.parent();
	},
	check: function(other) {
		//預設只有一次性效果, 所以 check 後要進入 prekill
		this.prekill();
		other.receiveDamage(this.attack);
		this.hurtEffect(other);
	},
	//進入自我消滅狀態(消除軌跡, 並不再具攻擊效果)
	prekill: function() {
		this.prekilling = true;
		this.checkAgainst = ig.Entity.TYPE.NONE;
	},
	//專屬受傷效果, 但目前沒有想法
	hurtEffect: function(other) {
		return;
	    //TODO
		ig.game.spawnEntity( EntityHurt, this.pos.x, this.pos.y, {
			target: other,
			hurtType: 'EntityLaserHurt',
			hurtSettings: {
					innerColor: '#fff',
					outterColor: 'red',

				particleSettings: {
				}
			}
		});
	}
});

//實作追蹤雷射, 加入追蹤功能
EntityTraceLaserBeam = EntityLaserBeam.extend({ 
    //追蹤目標
    target: null,

    //速限(影響初始時的移動速度及追蹤速度)
    maxVel: {
        x: 1000,
        y: 1000
    },

    //初始速度(追蹤前的速度)
    vel: {
    	x: 500,
    	y: 500,
    },

    //追蹤速度
    speed: 700,

    //啟動追蹤功能時的音效
    activeSound: null,

    //追蹤音量
    activeVolume : 1,

    //啟動追蹤功能前的等待時間
    idletime : 1,

    //變換方向的區間(追蹤用)
    interval: 0.1,

    //初始化時要受重力影響
    gravityFactor: 1,

    //啟動追蹤時的 callback
    activeCallback: null,

    //等待追蹤計時器( not configuable)
    idletimer: null,

    init: function(x, y, settings) {
        this.parent(x, y, settings);

		this.activeSound && (this.activeSound.volume = this.activeVolume);

        this.idletimer = new ig.Timer( this.idletime );

        this.initCallback && this.initCallback();
    },
    update: function() {
    	//沒有目標時, 不啟動追蹤
    	//NOTICE: 如果 target 死掉, 有時候回收裝置會把 target 清到剩下空的 object. 在traceTo時, 會出錯誤, 所以多做一次檢查 pos
        if ( this.target && this.target.pos && this.idletimer.delta() >= 0) {
        	this.active();

            this.idletimer.reset();
            this.idletimer.pause(); 
        }

        //追蹤到一半時, 目標消失也要取消追蹤
        if (!this.target || this.target._killed) {
        	this.lostTarget();
        }
        
        this.parent();
    },
    check : function(other) {
        //預設碰撞後, 就不再做追蹤, 否則會變成連續攻擊
    	this.traceStop();
    	this.parent(other);
    },
    //啟動追蹤
    active: function() {

    	//播放聲音
    	this.activeSound && this.activeSound.play();

		//追蹤時, 不受重力影響
    	this.gravityFactor = 0;

    	//追蹤功能
		this.traceTo(this.target, {
			speed: this.speed,
			interval: this.interval,
			collision: false,//?
		});


        //噴小煙花
        ig.game.spawnEntity( EntityDeathExplosion, this.pos.x, this.pos.y, {
			particles: Math.ceil(Math.random() * 3 ),
        	radius: {
            	max: 3,
            	min: 1
        	},
        	particleSettings: {
        		gravityFactor: 0,
        		innerColor: this.innerColor,
        		outterColor: this.outterColor,
        		friction: {
        			x: 0,
        			y: 0
        		},
        		lifetime: 1.2,
        	}
        });		

    	this.activeCallback && this.activeCallback();

    },
    //失去目標時
    lostTarget: function() {
    	this.traceStop();
    }
});


//裝備 雷射功能
EntityEquipLaserBeam = EntityLaserBeam.extend({
    //是否要停用
    showLaser: true,
    
    //不需要自動毀滅
    lifetime: 0,

    update: function() {
        this.pos = {
            x: this.target.pos.x + (this.target.size.x / 2) + this.offset.x,
            y: this.target.pos.y + (this.target.size.y / 2) + this.offset.y,
        }
        
        this.parent();
    },
    draw: function() {
        if ( this.showLaser) {
            this.parent();
        }
    }
});


//===== not stable =====
EntityHurt = ig.Entity.extend({
	//效果要出現在誰的身上
	target: null,

	//效果一段時後就復原了
	lifetime: 3,

	offset: {
		x: 0,
		y: 0,
	},

	//效果的特別設定
	hurtSettings: {
		particles: 1,
		radius: {
			max: 2,
			min: 2
		},
		particleSettings: {
			vel: {
				x: 10,
				y: 10
			},

		}
	},

	hurtType: 'EntityDeathExplosion',

	//效果發生的間隔
	interval : 0.5,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.intervalTimer = new ig.Timer( this.interval);
		this.lifeTimer = new ig.Timer (this.lifetime);
	},
	update: function() {
		console.log( this.target);
		if ( this.intervalTimer.delta() >= 0 ) {
			eval('ig.game.spawnEntity(' + this.hurtType + ', this.target.pos.x + this.offset.x, this.target.pos.y + this.offset.y,  this.hurtSettings);');
			this.intervalTimer.reset();
		}

		if ( this.lifeTimer.delta() >= 0 ) {
			this.kill();
			return;
		}

		this.parent();
	}

})

EntityLaserHurt = EntityHurt.extend({

	laserSize: 10,
	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.lifeTimer = new ig.Timer(this.lifetime);

		this.data = [{x: x, y: y}, {x: x, y: y - 10}];
	},

	draw: function() {

		var ctx = ig.system.context;
		ctx.save();
		ctx.beginPath();
	    ctx.lineCap = "round";
	    ctx.lineJoin = "miter";

//	    var centerPos = this.getCenterPos();
		ctx.moveTo( this.data[0].x, this.data[0].y );

		ctx.lineTo(this.data[1].x, this.data[1].y);

			//畫外圈
            ig.system.context.globalAlpha =  1 - (1 / this.data.length);
		    ctx.strokeStyle = this.outterColor;
			ctx.lineWidth = this.laserSize;
			ctx.stroke();

			//畫內層
            ig.system.context.globalAlpha =  1;			
		    ctx.strokeStyle = this.innerColor;
			ctx.lineWidth = this.laserSize / 2;
			ctx.stroke();
		ctx.restore();

		this.parent();
	},

	dra1w: function() {
		var painter = new ig.Painter;
/*
		painter.drawStrokeRectCorner({
			x: this.pos.x,
			y: this.pos.y,
			width: this.size.x,
			height: this.size.y,
			radius: this.radius,
			color: 'red',
			alpha: this.alpha,
		});
*/
		painter.drawFillRectCorner({
			x: this.pos.x,
			y: this.pos.y,
			width: this.size.x,
			height: this.size.y,
			radius: this.radius,
			color: '#fff',
			alpha: this.alpha,

		});

		painter.drawStrokeRectCorner({
			x: this.pos.x,
			y: this.pos.y,
			width: this.size.x,
			height: this.size.y,
			radius: this.radius,
			color: 'red',
			alpha: this.alpha,

		});


		painter.drawFillRectCorner({
			x: this.pos.x + 2,
			y: this.pos.y - 10,
			width: 2,
			height: 10,
			radius: this.radius,
			color: '#fff',
			alpha: this.alpha,

		});

		painter.drawStrokeRectCorner({
			x: this.pos.x + 2,
			y: this.pos.y - 10,
			width: 2,
			height: 10,
			radius: this.radius,
			color: 'red',
			alpha: this.alpha,

		});

	}


});

});

