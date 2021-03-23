安装配置

https://github.com/Zainking/learningPixi

# 初步

## 概念

### 创建一个pixi应用

stage是根容器

```javascript
let app = new PIXI.Application({width: 256, height: 256});
document.body.appendChild(app.view);
```

Application() 计算用webGl还是canvas

```
let app = new PIXI.Application({
    width: 256,         // default: 800
    height: 256,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);
```

改变背景色

```
app.renderer.backgroundColor = 0x061639;
```

改变画布宽高

```js
app.renderer.autoResize = true;
app.renderer.resize(512, 512);
```

canvas占据整个窗口

```
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
```

```
<style>* {padding: 0; margin: 0}</style>
```

### 舞台

```
app.stage
```