ig.module(
    'plugins.residueShadow'
)
.requires(
    'impact.entity'
)
.defines(function(){

    ig.Entity.inject({
        residueShadow: {
            //是否顯示
            show: false,

            //產生殘影的間距
            interval: 0.5,

            //殘影的存活時間
            lifetime: 1,

            //殘影的淡出時間
            fadetime: 3,
        },
        showResidueShadow: function(option) {
            ig.merge( this.residueShadow, option);
            this.residueShadow.timer = new ig.Timer(this.residueShadow.interval);
            this.residueShadow.show = true;
        },
        update: function() {
            if ( this.residueShadow.show && this.residueShadow.timer.delta() >= 0 ) {
                ig.game.spawnEntity(EntityResidueShadow, this.pos.x, this.pos.y, {
                    animSheet: this.animSheet,
                    anims: this.anims,
                    currentAnim: this.currentAnim,
                    lifetime: this.residueShadow.lifetime,
                    fadetime: this.residueShadow.fadetime,
                    zIndex: this.zIndex - 30,
                });

                this.residueShadow.timer.reset();
                ig.game.sortEntitiesDeferred();
            }
            this.parent();
        }

    });


    EntityResidueShadow = ig.Entity.extend({
        //殘影存活時間, 繼承自物件本身
        lifetime: 0,

        //殘影淡出時間, 繼承自物件本身
        fadetime: 0,

        //第幾層
        zIndex: 1,
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.lifeTimer = new ig.Timer(this.lifetime);
        },
        update: function() {
            if ( this.lifeTimer.delta() >= 0 ) {
                this.kill();
                return;
            }

            this.currentAnim.alpha = this.lifeTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);

            this.parent();
        }
    });
});