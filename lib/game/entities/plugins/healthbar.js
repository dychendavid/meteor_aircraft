ig.module(
	'game.entities.plugins.healthbar'
)
.requires(
	'impact.entity'
)
.defines(function(){


ig.Entity.inject({
    drawHealthBar: function() {
        // 畫血條
        // border/background
        ig.system.context.fillStyle = "rgb(0,0,0)";
        ig.system.context.beginPath();
        ig.system.context.rect(
                        (this.pos.x - ig.game.screen.x) * ig.system.scale, 
                        (this.pos.y - ig.game.screen.y - 8) * ig.system.scale, 
                        this.size.x * ig.system.scale, 
                        4 * ig.system.scale
                    );
        ig.system.context.closePath();
        ig.system.context.fill();
        
        // health bar
        ig.system.context.fillStyle = "rgb(255,0,0)";
        ig.system.context.beginPath();
        ig.system.context.rect(
                        (this.pos.x - ig.game.screen.x + 1) * ig.system.scale, 
                        (this.pos.y - ig.game.screen.y - 7) * ig.system.scale, 
                        ((this.size.x - 2) * (this.health / this.maxHealth)) * ig.system.scale, 
                        2 * ig.system.scale
                    );
        ig.system.context.closePath();
        ig.system.context.fill();
        this.parent();
    },
    draw: function() {
        this.drawHealthBar();
        this.parent();
    }  
})


});