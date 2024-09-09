ig.module(
	'game.entities.skill.bullet'
)
.requires(
	'game.entities.core.skill',

	'impact.entity'
)
.defines(function(){


EntityBullet = EntitySkill.extend({
	vel: {
		x: -200,
		y:0
	},
	config: {
		physicalDamage: 5,

		//每次傷害
		magicDamage: 2,

		//技能間隔多久扣一次血, 單位是秒, 最少是 0.1
		interval: 1,

		//技能持續時間
		duration: 5,

		//技能效果發動優先權
		priority: 10,

		//要不要初始化
		init: true,

		//受傷部位
		hurtPart: 'body',
	},
	size: {x: 20, y:40},
	checkAgainst: ig.Entity.TYPE.BOTH,

	animSheet: new ig.AnimationSheet( 'media/GBwind-effect01.png', 48, 48 ),

	init: function(x, y, settings) {
	    this.addAnim( 'moving', 0.1, [0, 1, 2, 3, 4] );	

	    if (settings.checkAgainst ) {
	    	this.checkAgainst = settings.checkAgainst;
	    }

        this.parent(x, y, settings);
	},
	draw: function() {
		this.parent();
	},
	check: function(other) {

/*
		var x,y;
		switch( this.config.hurtPart ) {
			case 'center':
			x = 	
		} ( this.config.hurtPart) {
			x = 
        	ig.game.spawnEntity(EntityDeathExplosion, this.pos.x + (this.size.x / 2), this.pos.y  + (this.size.y / 2) , {particles:10});
		}
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x + (this.size.x / 2), this.pos.y  + (this.size.y / 2) , {particles:10});
*/


		//該角色不吃效果
		if (0 && other.skillAcceptable ) {
			var priority = 10;
			var refresh = false;

			var effectIndex = other.addSkillEffect('fireball', function(effectIndex) {
				var skill = other[effectIndex];

				//第一次要初始化
				if( skill.init ) {
					skill.init = false;

					var start = skill.duration * -1;
					skill.range = {};
					skill.range.start = start;
					skill.range.end = start + skill.interval;

					//播放命中效果
					ig.game.spawnEntity( EntityExplode, other.pos.x, other.pos.y, {
					    duration: 2,
					    target: other
					});
				}

				//在時間區間內, 即觸發效果
				var currentTime = skill.timer.delta();
				if ( currentTime >= skill.range.start && currentTime <= skill.range.end ) {

					skill.range.start += skill.interval;
					skill.range.end += skill.interval;
					other.receiveDamage( skill.damage);

//	console.log( effectIndex + ':' + other.health);

					//時間到了之後, 要做回復
					if ( skill.range.end >= skill.duration ) {
	    				other.health = 100;
						other.removeSkillEffect(effectIndex);
					}
				}
			}, priority, refresh);
		
			//NOTICE 把技能資料記在目標物上, 可能會有記憶體問題?
			other[effectIndex] = this.config;


			//命中的當下開始計時
			other[effectIndex].timer = new ig.Timer(this.config.duration);
		}

		other.receiveDamage( this.config.physicalDamage);

		//命中瞬間即消滅
		this.kill();

	}

});

});