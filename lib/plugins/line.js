ig.module(
    'plugins.line'
)
.requires(
    'impact.entity'
)
.defines(function(){

ig.Entity.inject({
    line: {
        show: false,
    },
    showAsLine: function(option) {
        var settings = {
            interval: 0.01,//粒子拖行長度
            intervalTimer: null,
            num: 1,//長度
            current: 0,
            body: [],

            followInterval: 0.001//粒子間距
        };

        ig.merge(settings, option);
        this.line = settings;
        this.line.show = true;
        this.line.intervalTimer = new ig.Timer( this.line.interval );
    },
    update: function() {
        if ( this.line.show && this.line.current < this.line.num && this.line.intervalTimer.delta() >= 0) {

            var target = this.line.body[this.line.current] || this;

            var settings = {
                target: target,
                interval: this.line.followInterval,
                animSheet: this.animSheet,
                anims: this.anims,
                currentAnim: this.currentAnim,

            };
            this.line.current++;
            

            eval('var linebody = ig.game.spawnEntity( EntityLineBody , settings.target.pos.x, settings.target.pos.y, settings );');
            this.line.body.push(linebody);

            this.line.intervalTimer.reset();
        }
        this.parent();
    }

})


EntityLineBody = ig.Entity.extend({
    //目標, 繼承自角色本身 
    interval: 0.1,
    //目標, 繼承自角色本身
    target: null,

    init: function(x, y, settings) {
        this.parent(x, y, settings);

        this.timer = new ig.Timer(this.interval);
    },
    update: function() {
        if ( this.timer.delta() >= 0 ) {
            this.pos = this.target.pos;
            this.timer.reset();
        }
        if(this.target._killed) {
            this.kill();
        }

        this.parent();
    }

});

});