# Adaptive Mobile

移动终端的web自适应布局方案，通过`window.devicePixelRatio`动态设置`initial-scale`及根节点字体大小、body的字体大小等来实现移动端页面的自适应缩放，整体参考于淘宝的[lib-flexible](https://github.com/amfe/lib-flexible),造轮子只是为了加深理解。

## ⚠️JS使用注意事项

+ 由于需要动态设置初始缩放值、body的字体大小等，需要在所有资源加载之前执行这个js，可以**通过script标签内联**。
+ JS会动态创建`<meta name="viewport" content="...">`标签，缩放值的大小为`1 / window.devicePixelRatio`,如果**本来页面就存在该标签，将不会做任何改变**。
+ JS会在html标签上设置`data-dpr`,在body标签上设置默认字体大小。`data-dpr`用来在设置字体时根据不同dpr设置大小。

## 宽度单位与书写

一般基于iphone6的750px设计稿来进行页面开发，通过js设置之后，布局视口在视觉上与屏幕大小一样，但css像素数量多了四倍。这样的情况下可以直接量取设计稿的宽度来进行设置，考虑到自适应，用`rem`作为单位将会更方便。

**关于布局视口等相关概念不太了解可参见[H5移动多终端适配全解 - 从原理到方案](http://www.txliang.com/2017/02/23/H5-mobile-web-page-adaptation-principle/)**

rem单位可通过SCSS中的函数来设置：

```
@function px2rem($px, $default-font-size: 75px) {
  @if (unitless($px)) {
    @return px2rem($px + 0px);
  } @else if (unit($px) == rem) {
    @return $px;
  }
  @return ($px / $default-font-size) + rem;
}

// 用法
width: px2rem(80px);
```

或者寻找sublime等相关的px2rem插件，本方案测试采用scss进行样式书写。

## 字体设置

字体采用px。由于视口相应缩放，字体也会缩小，需要针对不同的dpr来设置字体大小。在scss中可以通过@mixin设置：

```
// $font-size 为在750px设计稿中量取的字体大小
@mixin fsize ($font-size) {
  font-size: $font-size / 2;
  [data-dpr="2"] & {
    font-size: $font-size;
  }
  [data-dpr="3"] & {
    font-size: $font-size * 1.5;
  }
}

// 用法
@include fsize(30px);
```

## 使用建议

+ 页面body标签中用一个标签包住所有内容，并设置该标签样式`margin-left: auto;margin-right: auto`来使得在iPad等非移动设备上保持一定宽度并居中，避免宽度拉伸变形。