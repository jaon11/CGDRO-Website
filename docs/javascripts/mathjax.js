// docs/javascripts/mathjax.js
window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true
  },
  options: {
    // 让 MathJax 处理整页 HTML（包含 mkdocs-jupyter 生成的 notebook HTML）
    // 不再用 processHtmlClass 限制到 arithmatex
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
  }
};

