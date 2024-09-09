ig.module(
    'game.entities.material.death-explosion'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityDeathExplosion = ig.Entity.extend({
        //引爆器的存在時間
        lifetime : 2,
        
        //引爆器消失的 callback
        callback : null,
        
        //粒子數
        particles: 10,

        //粒子大小
        radius: {
            max: 5,
            min: 2
        },

        //粒子設定
        particleSettings: {},
        
                
        init : function (x, y, settings) { 
            this.parent(x, y, settings);

            for (var ii = 0; ii < this.particles; ii +=1) {
                if ( this.radius.max  == this.radius.min ) {
                    var radius = this.radius.max;
                }
                else {
                    var radius = Math.ceil(Math.random() * (this.radius.max - this.radius.min)) + this.radius.min - 1;
                }
                var settings = this.particleSettings;
                settings.radius = radius;
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, settings);                    
            }
            
            this.idleTimer = new ig.Timer();
        },

        update : function () {
            if (this.idleTimer.delta() > this.lifetime) { 
                if (this.callback) { 
                    this.callback();
                }
                this.kill();

                return;
            }

            this.parent();
        }
    });


    EntityDeathExplosionParticle = ig.Entity.extend({
        //內圈顏色
        innerColor : '#990000',
             
        //外層顏色
        outterColor: '#E00000',

        //粒子半徑(大小)
        radius: 2,

        //粒子實際大小(用於偵測被粒子噴射到之單位)
        size : {x: 1, y: 1},
        
        //爆炸時, 最大的噴射力道
        maxVel : {x : 200, y : 200 },

        //基礎暴射速率
        //NOTICE: 因為有粒子彼此碰撞時, 彼此也會被摩擦力影響, 所以 x 會調大一點
        vel : {x : 85, y: 45 } ,

        //摩擦力(落地後, 不要讓血滾來滾去)
        //NOTICE: y 因為有引力的關係, 所以不用特別做摩擦力
        friction : {x : 50, y : 0},

        //反彈力
        bounciness  :0,

        //血塊生存時間
        lifetime: 3,
        
        //血塊淡出時間
        fadetime: 1,
        
        //透明度, 做淡出用(唯讀)
        alpha: 0,
        
        init : function (x,y, settings) {
            this.parent(x,y, settings);

            this.idleTimer = new ig.Timer();
            
            //被炸射後, 要往四處跑
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;            
            
        },
        update : function () {
            //計算淡出值
            this.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);

            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }

            this.parent();
        },
        draw: function() {
            var painter = new ig.Painter();

            //畫內圈
            painter.drawFillCircle({
                color   : this.innerColor, 
                centerX : this.pos.x,
                centerY : this.pos.y,
                radius  : this.radius,
                alpha   : this.alpha,
            });

            //畫外圈
            painter.drawStrokeCircle({
                color   : this.outterColor, 
                centerX : this.pos.x,
                centerY : this.pos.y,
                radius  : this.radius,
                alpha   : this.alpha 
            });

            this.parent();
        }

    });

});