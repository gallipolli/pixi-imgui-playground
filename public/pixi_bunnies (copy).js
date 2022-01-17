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
  
    ImGui.CreateContext();
    ImGui_Impl.Init(canvas);
    ImGui.StyleColorsDark();
    var io = ImGui.GetIO();
    const clear_color = new ImGui.ImVec4(0.3, 0.3, 0.3, 1.00);

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
          // ImGui.Text("Pen Pressure: %.1f", io.PenPressure); // Note: currently unused
          ImGui.TreePop();
      }
      ImGui.End();
      ImGui.EndFrame();
      ImGui.Render();
      
      bunny.rotation += 0.1;
      app.renderer.render(container);

      ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
      app.renderer.reset()

      window.requestAnimationFrame(_loop);
    }
  
  })();

















/*
var app, container, texture, pixiRenderer, bunny;

app = new PIXI.Application({
    width: canvas.width,
    height: canvas.height,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    view: canvas.el
});
console.log(canvas.el)
//document.body.appendChild(app.view)

container = new PIXI.Container();
app.stage.addChild(container);

texture = PIXI.Texture.from('public/assets/bunny.png');
bunny = new PIXI.Sprite(texture);

bunny.anchor.x = bunny.anchor.y = 0.5;
bunny.position.x = 250;
bunny.position.y = 250;
bunny.scale.set(1)
container.addChild(bunny);

//let's try drawing stuff onto the shared canvas.
//just going to use raw HTML canvas calls.


function raf(){
    app.renderer.reset()
    //console.log("hmm")
    bunny.rotation += 0.1;
    app.renderer.render(container);
    requestAnimationFrame(raf);
}

raf()
*/


/*
pixiRenderer = new PIXI.Renderer(canvas.width, canvas.height, {
	//context: renderer3D.context, // shared context with threejs
	//view: canvas.el,
	//resolution: canvas.pixelRatio,
	transparent: true,
});
*/

/*
// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;


// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.rotation -= 0.01 * delta;
});
*/

/*
//the following code doesn't work - once a canvas is defined as webgl (this happens when pixi works on the canvas)
//the context is set as webgl and getcontext 2d can no longer be used.
const c = document.getElementById('pixiCanvas');
const ctx = c.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 150, 100);
*/