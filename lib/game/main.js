ig.module("game.main")
  .requires(
    "impact.game",
    "impact.font",
    "plugins.painter",

    "plugins.moveTo",
    "game.entities.pointer",
    "game.entities.material.laser",
    "game.entities.material.explosion",
    //	'impact.debug.debug',
    "game.levels.dev"
  )
  .defines(function () {
    MyGame = ig.Game.extend({
      //impactJS
      // Load a font
      font: new ig.Font("media/04b03.font.png"),

      //清掉底色?
      clearColor: null,

      //Quasar customize
      //用來捲動地圖, 記住現在座標捲到哪了
      mainScroller: 0,

      //記住現在背景音樂. 是否播放中
      playing: null,

      //boss
      boss: null,

      //玩家
      player: null,

      //resource
      warningSound: new ig.Sound("media/sound/warning.ogg"),

      ggImg: new ig.Image("media/gameover.png"),

      mainMap: new ig.BackgroundMap(
        500,
        [
          [1, 2],
          [3, 4],
        ],
        "media/universe4.jpg"
      ),

      init: function () {
        // Initialize your game here; bind keys etc.
        ig.input.initMouse();
        ig.input.bind(ig.KEY.MOUSE1, "lbtn");
        ig.input.bind(ig.KEY.ESC, "esc");
        ig.input.bind(ig.KEY.SPACE, "restart");
        ig.input.bind(ig.KEY.ADD, "addvolume");
        ig.input.bind(ig.KEY.SUBSTRACT, "subvolume");
        ig.input.bind(ig.KEY.TAB, "switchmusic");

        ig.input.bind(ig.KEY.UP_ARROW, "up");
        ig.input.bind(ig.KEY.LEFT_ARROW, "left");
        ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
        ig.input.bind(ig.KEY.DOWN_ARROW, "down");
        ig.input.bind(ig.KEY.X, "attack");
        ig.input.bind(ig.KEY.Z, "laser");
        ig.input.bind(ig.KEY.SHIFT, "turbo");

        //初始化背景音樂
        ig.music.add("media/music/papercut.ogg", "papercut");
        ig.music.add("media/music/faint.ogg", "faint");
        ig.music.volume = 0.5;

        //random 無效?
        //		ig.music.random = true;
        ig.music.playing = true;

        //載入滑鼠
        this.spawnEntity(EntityPointer, 0, 0);

        //啟動遊戲
        this.restart();
      },
      loadLevel: function (data) {
        this.parent(data);

        //NOTICE: 要捲動的地圖, 必需手動建立, 或者不在 this.backgroundMaps 中.

        this.boss = this.getEntitiesByType("EntityEnemy")[0];
        this.player = this.getEntitiesByType("EntityPlayer")[0];
      },
      update: function () {
        //捲地圖控制
        this.mainScroller -= ig.system.tick * this.scrollSpeed;
        this.mainMap.setScreenPos(0, this.mainScroller);
        this.mainMap.repeat = true;

        //音量控制
        if (ig.input.state("addvolume")) {
          ig.music.volume += 0.01;
        }

        if (ig.input.state("subvolume")) {
          ig.music.volume -= 0.01;
        }

        //音樂開關
        if (ig.input.released("switchmusic")) {
          if (this.playing) {
            ig.music.pause();
          } else {
            ig.music.play();
          }
          this.playing = !this.playing;
        }

        //重新開始遊戲
        if (ig.input.state("restart")) {
          this.restart();
        }

        //如果遊戲還沒結束, 時間到要顯示 warning
        if (!this.gameovered && this.warningTimer.delta() >= 0) {
          this.warning();
        }

        //判斷遊戲是否結束
        if (this.boss._killed || this.player._killed) {
          this.gameover();
        }

        // Update all entities and backgroundMaps
        this.parent();
      },
      draw: function () {
        //畫背景地圖
        this.mainMap.draw();

        // Draw all entities and backgroundMaps
        this.parent();

        //gameover 遮罩要蓋在 entities 上面
        if (this.gameovered) {
          this.drawGameover();
        }

        var painter = new ig.Painter();
        painter.drawFillText({
          color: "white",
          font: "bold 10pt Arial Black",
          text: "Quasar Game",
          x: 10,
          y: 15,
          alpha: this.alpha,
        });

        // this.font.draw("Quasar Game", 0, 0, ig.Font.ALIGN.LEFT);
      },

      //慢動作模式
      slowMotion: function () {
        //目前不準確, 先拿掉
        ig.Timer.timeScale = 0.2;
        this.slowing = true;
      },

      //恢復正常
      normalMotion: function () {
        ig.Timer.timeScale = 1;
      },

      //遊戲暫停
      pause: function () {
        this._pause = true;
      },

      //啟動警告模式
      warning: function () {
        ig.game.spawnEntity(EntityWarning, ig.system.width / 2, 100, {
          sound: this.warningSound,
        });

        //只啟動一次
        this.warningTimer.reset();
        this.warningTimer.pause();

        this.boss.iamboss();
        this.scrollSpeed = 0;
      },

      //重新啟動遊戲
      restart: function () {
        this.loadLevel(LevelDev);
        ig.music.play("papercut");
        this.warningTimer = new ig.Timer(5);
        this.gameovered = false;
        this.scrollSpeed = 30;
      },

      //啟動 Game over 模式
      gameover: function () {
        this.gameovered = true;
      },

      //顯示遊戲結束效果
      drawGameover: function () {
        var painter = new ig.Painter();

        //show mask
        painter.drawFillRect({
          color: "#000",
          x: 0,
          y: 0,
          width: ig.system.realWidth,
          height: ig.system.realHeight,
          alpha: 0.7,
        });

        //show gameover
        //		var x = (ig.system.width - 304 ) / 2;
        var y = (ig.system.height - 37) / 2;
        var x = 60;
        this.ggImg.draw(x, y);
      },
    });

    EntityWarning = ig.Entity.extend({
      vel: {
        x: 0,
        y: 200,
      },
      maxVel: {
        x: 1000,
        y: 1000,
      },
      lifetime: 7,
      fadetime: 1,
      idletime: 1,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.lifeTimer = new ig.Timer(this.lifetime);

        this.idleTimer = new ig.Timer(this.idletime);

        this.sound.volume = 0.1;
        ig.music.fadeOut(1);
      },

      update: function () {
        //this.currentAnim.alpha = 0.5;
        //計算淡出值
        this.alpha = this.idleTimer
          .delta()
          .map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
        if (this.idleTimer.delta() >= this.lifetime) {
          this.kill();
          this.sound.stop();
          ig.music.play("faint");
          return;
        }

        if (this.pos.y <= ig.system.height / 2) {
          this.parent();
        } else if (!this.soundtimer) {
          this.sound.play();
          this.soundtimer = new ig.Timer(3.5);
        }
      },
      draw: function () {
        var painter = new ig.Painter();

        painter.drawFillRect({
          color: "white",
          x: 0,
          width: 1000,
          y: ig.system.realHeight / 2 - 70,
          height: 130,
          alpha: this.alpha,
        });

        painter.drawFillText({
          color: "red",
          font: "italic 90pt Arial Black",
          text: "WARNING",
          x: this.pos.x - 340,
          y: this.pos.y + 35,
          alpha: this.alpha,
        });

        this.parent();
      },
      kill: function () {
        ig.game.scrollSpeed = 300;
        this.parent();
      },
    });

    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main("#canvas", MyGame, 60, 800, 600, 1);
  });
