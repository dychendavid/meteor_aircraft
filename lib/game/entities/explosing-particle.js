ig.module(
    'game.entities.explosing-particle'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityExplosion = ig.Entity.extend({
        lifetime : 2,
        callback : null,

        particle: {
            //粒子數目            
            num: 25,
            //每個粒子的參數
            settings: null,

            //粒子的類型
            type: 'laser',
        },

        init : function (x, y, settings) { 
            this.parent(x, y, settings);

            for (var ii = 0; ii < this.particle.num; ii +=1) {
                switch( this.particle.type) {
                    case 'death':
                    ig.game.spawnEntity(EntityDeathParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0 });
                    break;

                    case 'laser':
                    ig.game.spawnEntity(EntityLaserParticle, x, y, this.particle.settings );
                    break;
                    
                }
            }

            this.idleTimer = new ig.Timer();
        },

        update : function () {
            if (this.idleTimer.delta() > this.lifetime) { 
                this.kill();
                if (this.callBack) { 
                    this.callBack();
                }
                return;
            }
        }
    });


    EntityDeathParticle = ig.Entity.extend({
        size : {x: 2, y: 2},
        maxVel : {x : 160, y : 200 },
        lifetime: 3,
        fadetime: 1,
        bounciness  :0,
        vel : {x : 65, y: 30 } ,
        friction : {x : 50, y : 0},
        collides : ig.Entity.COLLIDES.NONE,
        colorOffset : 0,
        totalColors : 7,
        animSheet  : new ig.AnimationSheet ('media/blood.png', 4,4),
        init : function (x,y, settings) {
            this.parent(x,y, settings);

            //blood.png 有內建幾個色塊可以用, 可以用來做血的變化
            var frameID = Math.random(Math.random() * this.totalColors) + (this.colorOffset * (this.totalColors + 1));
            this.addAnim('idle', 0.2, [frameID]);

            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },

        update : function () {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }

            //fade out
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);

            this.parent();
        }

    });


    EntityLaserParticle = ig.Entity.extend({
        //導彈大小
        size : {
            x: 2,
            y: 2
        },

        //導彈粒子初暴射時的速度
        vel: {
            x: 50,
            y: 50
        },

        //導彈追蹤速度的上限.
        maxVel: {
            x: 1000,
            y: 1000
        },

        //施放後間隔多久開始追蹤
        waitToFollow: 1,
        waitTimer: null,

        gravityFactor:10,

        //導彈追蹤速度
        speed: 300,

        //導彈變換方向的時間區間
        interval: 0.1,

        //雷射的 callback
        callback: null,
        callbackTime: 0,
        callbackTimer: null,

        //攻擊力
        attack: 0,

        animSheet  : new ig.AnimationSheet ('media/blood.png', 4,4),

        init : function (x, y, settings) {
            this.parent(x,y, settings);

            this.addAnim('idle', 0.2, [0]);

            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.waitTimer = new ig.Timer( this.waitToFollow );

            if( this.callbackTime) {
                this.callbackTimer = new ig.Timer(this.callbackTime);
            }

            this.showResidueShadow({
                interval: 0.2,
                lifetime: 0.8,
                fadetime: 3
            });

//            this.showAsLine();
        },

        update : function () {
            if( this.callbackTime && this.callback && this.callbackTimer.delta() >= 0) {
                this.callback();
            }

            if (this.waitTimer.delta() >= 0) {
                var me = this;
                this.setDirection( this.target, {
                    speed: this.speed,
                    timeout: 1,
                    callback: function() {
                        me.setDirection( me.target, {
                            speed: me.speed,
                            interval: me.interval
                        });
                    }
                } );
                this.waitTimer.reset();
                this.waitTimer.pause();
            }

            this.parent();
        },
        check: function(other) {
            if (other == this.target && this.attack) {
                other.receiveDamage(this.attack);
            }
            this.kill();
        }

    });



    EntityGrenade = ig.Entity.extend({
        size: {x:4, y:4},
        offset: {x:2, y:2},
        animSheet: new ig.AnimationSheet(
        'media/grenade.png', 8, 8),
        type: ig.Entity.TYPE.NONE,
        maxVel : {x:200, y: 200},
        bounciness: 0.6,
        bounceCounter: 0,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function (x, y, settings) {
            this.parent(x + (settings.flip ? -4 : 7), y, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0,1]);

        },

        handleMovementTrace: function (res) {
            this.parent(res);
            if (res.collision.x || res.collision.y) {
                // bounce three times
                this.bounceCounter+=1;
                if (this.bounceCounter > 3 ) {
                    this.kill();
                }
            }
        },
        check : function (other) {
            other.receiveDamage(10, this);
            this.kill();
        },

        kill : function() {
            for (var ii = 0; ii < 20; ii +=1 ) {
                ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
            }
            this.parent();
        }

    });

    EntityGrenadeParticle = ig.Entity.extend({
        size : {x: 1, y: 1},
        maxVel : {x : 160, y : 200 },
        lifetime: 1,
        fadetime: 1,
        bounciness  :0.3,
        vel : {x : 40, y: 50 } ,
        friction : {x : 20, y : 20},
        checkAgainst : ig.Entity.TYPE.B,
        collides : ig.Entity.COLLIDES.LITE,
        animSheet  : new ig.AnimationSheet ('media/explosion.png', 1,1),
        init : function (x,y,settings) {
            this.parent(x,y, settings);
            this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random()*7);
            this.addAnim('idle', 0.2, [frameID]);
        },

        update : function () {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
        }


    });

    });