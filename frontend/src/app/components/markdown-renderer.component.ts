import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import katex from 'katex';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container class="markdown-content" [innerHTML]="renderedContent"></div>
    <svg #markmap *ngIf="isMarkmap" class="markmap-svg"></svg>
  `,
  styles: [`
    .markdown-content {
      line-height: 1.6;
      font-size: 15px;
    }

    .markdown-content h1 {
      font-size: 24px;
      margin: 20px 0 10px 0;
      border-bottom: 2px solid #eee;
      padding-bottom: 5px;
    }

    .markdown-content h2 {
      font-size: 20px;
      margin: 18px 0 8px 0;
      border-bottom: 1px solid #eee;
      padding-bottom: 4px;
    }

    .markdown-content h3 {
      font-size: 18px;
      margin: 16px 0 6px 0;
    }

    .markdown-content p {
      margin: 10px 0;
    }

    .markdown-content code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }

    .markdown-content pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 15px 0;
    }

    .markdown-content pre code {
      background: none;
      padding: 0;
    }

    .markdown-content ul, .markdown-content ol {
      margin: 10px 0;
      padding-left: 30px;
    }

    .markdown-content li {
      margin: 5px 0;
    }

    .markdown-content blockquote {
      border-left: 4px solid #ddd;
      padding-left: 15px;
      margin: 15px 0;
      color: #666;
    }

    .markdown-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }

    .markdown-content th, .markdown-content td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }

    .markdown-content th {
      background: #f5f5f5;
      font-weight: bold;
    }

    .markdown-content a {
      color: #007bff;
      text-decoration: none;
    }

    .markdown-content a:hover {
      text-decoration: underline;
    }

    .markmap-svg {
      width: 100%;
      height: 500px;
      border: 1px solid #ddd;
      border-radius: 6px;
      margin: 15px 0;
    }
  `]
})
export class MarkdownRendererComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() content: string = '';
  @ViewChild('container') container!: ElementRef;
  @ViewChild('markmap') markmapSvg!: ElementRef;
  
  renderedContent: string = '';
  isMarkmap: boolean = false;
  private markmapInstance: any;

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
      this.renderedContent = '';
      return;
    }

    // Check if content is a markmap (starts with markmap code fence)
    if (this.content.trim().startsWith('```markmap') || this.content.includes('```markmap')) {
      this.isMarkmap = true;
      this.renderedContent = '';
      return;
    }

    this.isMarkmap = false;

    // First process LaTeX before markdown parsing
    let processedContent = this.content;
    
    // Handle display LaTeX: $$...$$ (must be done before inline)
    processedContent = processedContent.replace(/\$\$(.+?)\$\$/gs, (match: string, latex: string) => {
      try {
        const rendered = katex.renderToString(latex, { displayMode: true, throwOnError: false });
        return `<div class="katex-display">${rendered}</div>`;
      } catch (e) {
        console.error('KaTeX display render error:', e);
        return match;
      }
    });

    // Handle inline LaTeX: $...$
    processedContent = processedContent.replace(/\$(.+?)\$/g, (match: string, latex: string) => {
      try {
        const rendered = katex.renderToString(latex, { throwOnError: false });
        return `<span class="katex-inline">${rendered}</span>`;
      } catch (e) {
        console.error('KaTeX inline render error:', e);
        return match;
      }
    });

    // Configure marked
    marked.setOptions({
      breaks: true,
      gfm: true
    });

    // Render markdown
    this.renderedContent = marked.parse(processedContent) as string;
  }

  private renderMarkmap(): void {
    if (!this.markmapSvg || !this.content) return;

    try {
      // Extract markmap content
      let markmapContent = this.content;
      const markmapMatch = this.content.match(/```markmap\s*([\s\S]*?)```/);
      if (markmapMatch) {
        markmapContent = markmapMatch[1].trim();
      }

      // Transform markdown to markmap data
      const transformer = new Transformer();
      const { root } = transformer.transform(markmapContent);

      // Create markmap
      const svg = this.markmapSvg.nativeElement;
      this.markmapInstance = Markmap.create(svg, undefined, root);
    } catch (error) {
      console.error('Failed to render markmap:', error);
    }
  }
}
