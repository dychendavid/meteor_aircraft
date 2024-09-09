ig.module(
    'plugins.fade-control'
)
.requires(
    'impact.entity',
    'impact.input'
)
.defines(function() {    
    ig.Entity.inject({
        faded: false,
        fadeMode: 'stop',
        update: function() {
            this.parent();
            if (this.fadeMode == 'fadeIn' ) {
                this._fadeIn();
            }
            else if( this.fadeMode == 'fadeOut') {
                this._fadeOut();   
            }
            else if (this.fadeMode == 'stop' ) {
                if ( this.fadeCallback ) {
                    this.fadeCallback();
                }           
                if (this.readyToKill) {
                    this.kill();
                }
            }        
        },
        fadeIn: function(second, readyToKill, callback) {
            if ( !this.faded ) {
                this._beforeFade('fadeIn', second, readyToKill, callback);
            }
        },
        fadeOut: function(second, readyToKill, callback) {
            if ( !this.faded ) {
                this._beforeFade('fadeOut', second, readyToKill, callback);
            }
        },
        setFaded: function( bool ) {
            this.faded = (bool == true);
        },
        _fadeIn: function() {
            if ( this.fadeTimer.delta() <= 0) {
                this.currentAnim.alpha = this.getAlpha('fadeIn', this.fadeTimer.delta(), this.fadeSecond);
            } else {
                this.fadeMode = 'stop';
            }
        },
        _fadeOut: function() {
            if (this.fadeTimer.delta() <= 0) {
                this.currentAnim.alpha = this.getAlpha('fadeOut', this.fadeTimer.delta(), this.fadeSecond);
            } else {
                this.fadeMode = 'stop';
            }
        },
        _beforeFade: function(fadeMode, second, readyToKill, callback) {
            this.fadeMode = fadeMode;
            this.fadeSecond = second;
            this.fadeTimer = new ig.Timer(second);
            this.readyToKill = readyToKill;
            this.fadeCallback = callback;
            this.faded = true;
        },
        getAlpha: function( mode, delta, target ) {
            var alpha = 1;
            if ( mode == 'fadeIn')  {
                 alpha = 1 + (delta / target);
            }
            else {
                 alpha = 0 - (delta / target);    
            }
            
            return alpha;
        }
    });
});