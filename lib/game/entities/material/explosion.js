ig.module(
    'game.entities.material.explosion'
)
.requires(
    'impact.entity'
)
.defines(function(){

    EntityExplosion = ig.Entity.extend({
        //引爆器的存在時間
        lifetime : 2,
        
        //引爆器消失的 callback
        callback : null,
        
        //粒子數
        particles: 10,

        //粒子的 class
        particleType: 'EntityDeathParticle',

        //粒子設定
        particleSettings: {
            vel: {
                x: 0,
                y: 0,
            }
        },

        //暴射速率
        explodeVel: {
            x: 85,
            y: 45,
        },

        //explosion 不受影力控置        
        gravityFactor: 0,
                
        init : function (x, y, settings) { 
            this.parent(x, y, settings);

            var settings = this.particleSettings;
            for (var ii = 0; ii < this.particles; ii +=1) {

                //被炸射後, 要往四處跑
                settings.vel.x = (Math.random() * 2 - 1) * this.explodeVel.x;
                settings.vel.y = (Math.random() * 2 - 1) * this.explodeVel.y;            

                eval('ig.game.spawnEntity(' + this.particleType + ', x, y, settings);');                    
            }
            
            this.idleTimer = new ig.Timer();
        },

        update : function () {
            if (this.idleTimer.delta() > this.lifetime) { 
                this.callback && this.callback();
                this.kill();

                return;
            }

            this.parent();
        }
    });



});