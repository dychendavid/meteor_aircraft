ig.module(
    'game.entities.pointer'
)
.requires(
    'impact.entity'
)
.defines(function(){


EntityPointer = ig.Entity.extend({
    checkAgainst: ig.Entity.TYPE.BOTH,

    size: {x:1, y:1},

    ready: function() {
        ig.input.initMouse();
        ig.input.bind(ig.KEY.MOUSE1, 'lbtn');
    },
    update: function() {
        
        // Update the position to follow the mouse cursor. You
        // may also have to account for ig.game.screen.x/y here 
        this.pos.x = ig.input.mouse.x;
        this.pos.y = ig.input.mouse.y;

        // Only check for the click once per frame, instead of
        // for each entity it touches in the 'check' function
        this.isClicking = ig.input.pressed('lbtn');
        
//        console.log('pointer update', this.pos.x, this.pos.y);
    },
    
    check: function( other ) {
        // User is clicking and the 'other' entity has 
        // a 'clicked' function?
        if( this.isClicking  && typeof(other.clicked) == 'function' ) {
            other.clicked(this);
        }
    }
});


});