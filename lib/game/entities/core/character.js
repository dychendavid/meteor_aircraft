ig.module(
	'game.entities.core.character'
)
.requires(
	'impact.entity'
)
.defines(function(){



EntityCharacter = ig.Entity.extend({
    type:ig.Entity.TYPE.B,
    maxHealth: 50,
    pows: [],

    receiveDamage: function(damage) {
        //show pow
        this.pows.push( ig.game.spawnEntity(EntityPow, this.pos.x + (this.size.x / 2) + Math.random() * -15 , this.pos.y  + (this.size.y / 2) - (this.pows.length) , {particles:3}) );

        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x + (this.size.x / 2), this.pos.y  + (this.size.y / 2) , {particles:3});
        this.parent(damage);
    },
    kill: function() {
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x + (this.size.x / 2), this.pos.y  + (this.size.y / 2) , {particles:25});
        this.parent();
    },
    drawBorder: function(strokeStyle, LineWidth) {
        var ct = new ig.ContextTools();
        ct.drawContextStrokeRect(strokeStyle, LineWidth, ig.system.getDrawPos(this.pos.x), ig.system.getDrawPos(this.pos.y), ig.system.getDrawPos(this.size.x), ig.system.getDrawPos(this.size.y));
        
    }

});




//skill-manage
EntityCharacter.inject({
    skillAcceptable: true,
    init: function(x, y, settings) {
        this.effects = {};
        this.effectsSorted = [];
        this.parent(x, y, settings);
    },
    update: function() {
        //檢查目標物現在是不是 技能無效
        if ( this.skillAcceptable ) {
            this.triggerSkillEffects();
        }
        this.parent();
    },
    triggerSkillEffects: function() {
        //impactJS 會增加兩個 function 在 array 最後, 不阻擋會出問題
        //第一個排序是優先權
        //第二個排序是該技能種類的先後順序

        for(var priority in this.effectsSorted) {
            if (priority == 'erase') {
                break;
            }

            var groupByPriority = this.effectsSorted[priority];

            for(var effectName in groupByPriority) {
                if (effectName == 'erase') {
                    break;
                }

                var groupByName = groupByPriority[effectName];

                for(var effectNo in groupByName) {
                    if (effectNo == 'erase') {
                        break;
                    }

                    var effectIndex = priority + '-' + effectName + '-' + effectNo;
                    this.effects[ effectIndex ]( effectIndex );
                }

            }

        }
    },
    addSkillEffect: function(effectName, func, priority, refresh) {

        var effectsSorted = this.effectsSorted;
        
        effectsSorted[priority] = effectsSorted[priority] || [];
        
        effectsSorted[priority][effectName] = effectsSorted[priority][effectName] || [];

		//TODO 確認 effectNo 一直增加, 會不會很吃記憶體        
        var effectNo = effectsSorted[priority][effectName].length;
    	
    	var effectIndex = priority + '-' + effectName + '-' + effectNo;

        if ( refresh ) {
            effectsSorted[priority][effectName] = [ effectIndex ];
        }
        else {
            effectsSorted[priority][effectName].push( effectIndex );
        }
        
        this.effectsSorted = effectsSorted;

        this.effects[ effectIndex ] = func;

        return effectIndex;

    },
    removeSkillEffect: function(effectIndex) {
        delete this.effects[ effectIndex ];

        var structure = effectIndex.split('-');            

        delete this.effectsSorted[ structure[0] ][ structure[1] ][ structure[2] ];
    }
});



EntityCharacter.inject({

    moveTo: function(x, y, start_speed, accel) {
        this.EntityStatus = 'moving';

        var start_speed_x = start_speed;
        var accel_add_x = accel;
        var start_speed_y = start_speed;
        var accel_add_y = accel;

        var dx = this.pos.x - x;
        var dy = this.pos.y - y;
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
        if ( this.EntityStatus != 'moving') {
            this.parent(res);
            return;
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

});


});