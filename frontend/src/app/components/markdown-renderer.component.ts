import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation, // 必须导入
  SecurityContext
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // 必须导入
import { marked } from 'marked';
import katex from 'katex';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [CommonModule],
  // 【关键配置 1】关闭视图封装，允许全局样式(Katex CSS)生效，允许组件样式作用于 innerHTML
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- 使用 [innerHTML] 绑定经过安全处理的 HTML -->
    <div #container class="markdown-content" [innerHTML]="safeRenderedContent"></div>
    <svg #markmap *ngIf="isMarkmap" class="markmap-svg"></svg>
  `,
  styles: [`
    /* 你的原有样式 */
    .markdown-content {
      line-height: 1.6;
      font-size: 15px;
      color: #333; /* 建议添加基础颜色 */
    }

    /* ...保留你之前的所有 h1-h3, p, code, pre 等样式... */
    .markdown-content h1 { font-size: 24px; margin: 20px 0 10px 0; border-bottom: 2px solid #eee; padding-bottom: 5px; }
    .markdown-content h2 { font-size: 20px; margin: 18px 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    .markdown-content h3 { font-size: 18px; margin: 16px 0 6px 0; }
    .markdown-content p { margin: 10px 0; }
    .markdown-content code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 14px; }
    .markdown-content pre { background: #f5f5f5; padding: 15px; border-radius: 6px; overflow-x: auto; margin: 15px 0; }
    .markdown-content pre code { background: none; padding: 0; }
    .markdown-content ul, .markdown-content ol { margin: 10px 0; padding-left: 30px; }
    .markdown-content li { margin: 5px 0; }
    .markdown-content blockquote { border-left: 4px solid #ddd; padding-left: 15px; margin: 15px 0; color: #666; }
    .markdown-content table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    .markdown-content th, .markdown-content td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    .markdown-content th { background: #f5f5f5; font-weight: bold; }
    .markdown-content a { color: #007bff; text-decoration: none; }
    .markdown-content a:hover { text-decoration: underline; }

    /* KaTeX 样式修正 */
    .markdown-content .katex {
      font-size: 1.1em; /*稍微调大一点公式字体*/
    }

    /* 防止长公式撑破容器，添加滚动条 */
    .markdown-content .katex-display {
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0.5em 0;
      margin: 1em 0;
    }

    .markmap-svg {
      width: 100%;
      height: 500px;
      border: 1px solid #ddd;
      border-radius: 6px;
      margin: 15px 0;
      background: #fff;
    }
  `]
})
export class MarkdownRendererComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() content: string = '';
  @ViewChild('container') container!: ElementRef;
  @ViewChild('markmap') markmapSvg!: ElementRef;

  // 使用 SafeHtml 类型
  safeRenderedContent: SafeHtml = '';
  isMarkmap: boolean = false;
  private markmapInstance: any;

  // 注入 DomSanitizer
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.renderContent();
  }

  ngOnChanges(): void {
    this.renderContent();
  }

  ngAfterViewInit(): void {
    if (this.isMarkmap && this.markmapSvg) {
      this.renderMarkmap();
    }
  }

  private renderContent(): void {
    if (!this.content) {
      this.safeRenderedContent = '';
      return;
    }

    // 检查 Markmap
    if (this.content.trim().startsWith('```markmap') || this.content.includes('```markmap')) {
      this.isMarkmap = true;
      this.safeRenderedContent = '';
      return;
    }

    this.isMarkmap = false;

    // ==========================================
    // 【修正点】更安全的占位符策略
    // ==========================================

    const mathMap: { [key: string]: string } = {};
    let mathCounter = 0;

    // 辅助函数：渲染 LateX 并返回占位符
    const replaceMath = (match: string, latex: string, isDisplay: boolean) => {
      // 【关键修改】使用了 UUID 风格的纯文本占位符，不包含下划线或星号等 Markdown 敏感字符
      // 使用 "MATH_KV_BLOCK_" 这种中间带下划线的单词通常是安全的，
      // 但为了绝对安全，我们用横杠 "-"
      const uniqueId = Math.random().toString(36).substr(2, 9);
      const placeholder = `MATH-ITEM-${mathCounter++}-${uniqueId}-END`;

      try {
        const renderedHtml = katex.renderToString(latex, {
          displayMode: isDisplay,
          throwOnError: false,
          output: 'html',
          trust: true
        });
        mathMap[placeholder] = renderedHtml;
        return placeholder;
      } catch (e) {
        console.error('KaTeX render error:', e);
        return match;
      }
    };

    let processedContent = this.content;

    // 1. 提取 Display Math ($$...$$)
    processedContent = processedContent.replace(/\$\$(.+?)\$\$/gs, (match, latex) => {
      return replaceMath(match, latex, true);
    });

    // 2. 提取 Inline Math ($...$)
    processedContent = processedContent.replace(/\$(.+?)\$/g, (match, latex) => {
      if (!latex || !latex.trim()) return match;
      return replaceMath(match, latex, false);
    });

    // 3. 配置 Marked
    marked.setOptions({
      breaks: true,
      gfm: true,
      pedantic: false
    });

    try {
      // 4. 解析 Markdown
      // 此时 placeholder 只是普通的文本字符串（如 "MATH-ITEM-0-xyz-END"），Marked 不会乱改它
      let html = marked.parse(processedContent) as string;

      // 5. 还原 LaTeX HTML
      Object.keys(mathMap).forEach(placeholder => {
        // 全局替换
        html = html.split(placeholder).join(mathMap[placeholder]);
      });

      // 6. 安全赋值
      this.safeRenderedContent = this.sanitizer.bypassSecurityTrustHtml(html);

    } catch (error) {
      console.error('Markdown parsing error:', error);
      this.safeRenderedContent = this.content;
    }
  }

  private renderMarkmap(): void {
    if (!this.markmapSvg || !this.content) return;

    // 先清理旧实例
    if (this.markmapInstance) {
        this.markmapSvg.nativeElement.innerHTML = '';
        this.markmapInstance = null;
    }

    try {
      let markmapContent = this.content;
      const markmapMatch = this.content.match(/```markmap\s*([\s\S]*?)```/);
      if (markmapMatch) {
        markmapContent = markmapMatch[1].trim();
      }

      const transformer = new Transformer();
      const { root } = transformer.transform(markmapContent);
      const svg = this.markmapSvg.nativeElement;
      this.markmapInstance = Markmap.create(svg, undefined, root);

      // 适应容器大小
      setTimeout(() => {
          if (this.markmapInstance) this.markmapInstance.fit();
      }, 100);

    } catch (error) {
      console.error('Failed to render markmap:', error);
    }
  }
}
