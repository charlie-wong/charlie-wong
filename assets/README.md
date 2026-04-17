# SVG 内嵌字体数据

- 字体编辑器 <https://www.glyphrstudio.com/>
- 打字 SVG 图片 <https://readme-typing-svg.demolab.com/demo/>
- 删除多余字符 <https://tophix.com/zh-cn/font-tools/font-editor>

```bash
base64    字体.woff2  > 字体.base64 # 将字体转换为 Base64 编码
base64 -d 字体.base64 > 字体.woff2  # 还原二进制字体数据格式
```

```css
/* ttf 格式 */
@font-face {
  font-family: '字体名称';
  font-style: normal;
  font-weight: 400;
  font-display: fallback;
  src: url(data:font/truetype;base64,字体文本化数据 format('truetype');
}

/* woff2 格式 */
@font-face {
  font-family: '字体名称';
  font-style: normal;
  font-weight: 400;
  font-display: fallback;
  src: url(data:font/woff2;base64,字体文本化数据 format('woff2');
}
```
