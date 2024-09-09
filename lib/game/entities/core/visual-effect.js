ig.module(
	'game.entities.core.visual-effect'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityVisualEffect = ig.Entity.extend({
	_wmIgnore: true
});

});