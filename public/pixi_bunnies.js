//https://github.com/davidfig/pixi-viewport

(async function() {
    //define the canvas properties
    await ImGui.default();
    const canvas = document.getElementById("pixiCanvas");
    const devicePixelRatio = window.devicePixelRatio || 1;
    //canvas.width = canvas.scrollWidth * devicePixelRatio;
    canvas.width = canvas.scrollHeight * devicePixelRatio;
    console.log(canvas.width);
    //canvas.height = canvas.scrollHeight * devicePixelRatio;
    canvas.height = canvas.scrollHeight * devicePixelRatio;
    console.log(canvas.height);
    window.addEventListener("resize", () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = canvas.scrollHeight * devicePixelRatio;
      canvas.height = canvas.scrollHeight * devicePixelRatio;
    });
    
    //imgui initialization
    ImGui.CreateContext();
    ImGui_Impl.Init(canvas);
    ImGui.StyleColorsDark();
    var io = ImGui.GetIO();
    const clear_color = new ImGui.ImVec4(0.3, 0.3, 0.3, 1.00);
    io.Fonts.AddFontDefault();
    //io.Fonts.AddFontFromFileTTF("../public/assets/xkcd-script.ttf", 24.0);
    //define pixi stuff below
    var app, container, texture, bunny;
    const DefaultBunnyScale = 1;

    app = new PIXI.Application({
        width: canvas.width,
        height: canvas.height,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
        view: canvas
    });
    console.log(canvas)
    //document.body.appendChild(app.view)

    const viewport = new pixi_viewport.Viewport({
        screenWidth: canvas.width,
        screenHeight: canvas.height,
        worldWidth: 2000,
        worldHeight: 2000,
    
        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })

    // add the viewport to the stage
    app.stage.addChild(viewport)

    // activate plugins
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()

    container = new PIXI.Container();
    //app.stage.addChild(container);
    viewport.addChild(container)
    texture = PIXI.Texture.from('public/assets/bunny.png');
    bunny = new PIXI.Sprite(texture);

    bunny.anchor.x = bunny.anchor.y = 0.5;
    bunny.position.x = 250;
    bunny.position.y = 250;
    bunny.scale.set(DefaultBunnyScale)
    //console.log(bunny.scale.x);
    container.addChild(bunny);

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(0xDE3249, 1);
    graphics.drawCircle(100, 250, 3);
    graphics.drawCircle(300, 150, 3);
    graphics.endFill();
    container.addChild(graphics);

    const realPath = new PIXI.Graphics();
    
    realPath.lineStyle(2, 0xDE3249, 1);
    realPath.moveTo(0, 0);
    realPath.lineTo(100, -100);
    realPath.lineTo(200,-100);
    //ealPath.lineTo(240, 100);

    realPath.position.x = 100
    realPath.position.y = 250;

    container.addChild(realPath);

    window.requestAnimationFrame(_loop);
    function _loop(time) {
      ImGui_Impl.NewFrame(time);
      ImGui.NewFrame();

      ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
      ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 140), ImGui.Cond.FirstUseEver);
      ImGui.Begin("Bunny Scale");
      //ImGui.SetWindowFontScale(1) 
      ImGui.Text(`Framerate (FPS) = ${ImGui.GetIO().Framerate}`);
      ImGui.Text(`Current Bunny Scale is ${bunny.scale.x}`);
      if(ImGui.Button("Toggle the bunny scale")){
          if(bunny.scale.x === 1){
            bunny.scale.set(2);
          }
          else if(bunny.scale.x === 2){
            bunny.scale.set(1);
          }
      }
      if (ImGui.TreeNode("Mouse State"))
      {
          if (ImGui.IsMousePosValid())
              ImGui.Text(`Mouse pos: (${io.MousePos.x}, ${io.MousePos.y})`);
          else
              ImGui.Text("Mouse pos: <INVALID>");
          ImGui.Text(`Mouse delta: (${io.MouseDelta.x}, ${io.MouseDelta.y})`);

          const count = ImGui.ARRAYSIZE(io.MouseDown);
          ImGui.Text("Mouse down:");     for (let i = 0; i < count; i++) if (ImGui.IsMouseDown(i))             { ImGui.SameLine(); ImGui.Text(`b${i} (${io.MouseDownDuration[i].toFixed(2)} secs)`); }
          ImGui.Text("Mouse clicked:");  for (let i = 0; i < count; i++) if (ImGui.IsMouseClicked(i))          { ImGui.SameLine(); ImGui.Text(`b${i} (${ImGui.GetMouseClickedCount(i)})`); }
          ImGui.Text("Mouse released:"); for (let i = 0; i < count; i++) if (ImGui.IsMouseReleased(i))         { ImGui.SameLine(); ImGui.Text(`b${i}`); }
          ImGui.Text(`Mouse wheel: ${io.MouseWheel.toFixed(1)}`);
          ImGui.Text(`Mouse capture flag: ${io.WantCaptureMouse}`);
          
          // ImGui.Text("Pen Pressure: %.1f", io.PenPressure); // Note: currently unused
          ImGui.TreePop();
      }
      ImGui.End();
      ImGui.EndFrame();
      ImGui.Render();
      //if the mouse is over an Imgui window, pause the viewport interactions
      if (io.WantCaptureMouse == true){
          viewport.pause = true;
      }
      else viewport.pause = false;
      bunny.rotation += 0.1;
      app.renderer.render(viewport);

      ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
      app.renderer.reset()

      window.requestAnimationFrame(_loop);
    }
  
  })();

/* useful links below
how pixijs renderer works
https://blog.cjgammon.com/pixijs-basic/

capturing mouse events selectively
https://github.com/ocornut/imgui/issues/364

adding grids in pixi js
https://jasonsturges.medium.com/ruled-graph-paper-in-pixi-js-68a1aeeaf6cf

pixi viewport library
https://github.com/davidfig/pixi-viewport
see this forum discussion for general info on pan and zoom:
  https://www.html5gamedevs.com/topic/31519-pixijs-pan-zoom-canvas/

svg render in pixi
https://codepen.io/osublake/pen/ORJjGj

unrelated but cool stuff
https://brm.io/matter-js/

pixijs + three js demo
https://jsfiddle.net/yrLk18vb/3/

*/
















  