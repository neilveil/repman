import{_ as n,c as s,e,o as p}from"./app-CXqbGNUo.js";const t={};function l(c,a){return p(),s("div",null,a[0]||(a[0]=[e(`<h1 id="docs" tabindex="-1"><a class="header-anchor" href="#docs"><span>Docs</span></a></h1><p>Add repman configuration file with name <code>repman.yaml</code> &amp; run command <code>repman</code>. Voila!</p><h2 id="configuration-file" tabindex="-1"><a class="header-anchor" href="#configuration-file"><span>Configuration File</span></a></h2><p>Add <code>repman.yaml</code> file.</p><div class="language-yaml" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token key atrule">repositories</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>repo<span class="token punctuation">-</span><span class="token number">1</span></span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> git@github.com<span class="token punctuation">:</span>neilveil/repman.git</span>
<span class="line">    <span class="token key atrule">branch</span><span class="token punctuation">:</span> master</span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>repo<span class="token punctuation">-</span><span class="token number">2</span></span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> git@github.com<span class="token punctuation">:</span>neilveil/repman.git</span>
<span class="line">    <span class="token key atrule">branch</span><span class="token punctuation">:</span> master</span>
<span class="line"></span></code></pre></div><h2 id="run-repman" tabindex="-1"><a class="header-anchor" href="#run-repman"><span>Run Repman</span></a></h2><p>Run <code>repman</code> command from <code>repman.yaml</code> file directory.</p><div class="language-bash" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">repman</span>
<span class="line"></span></code></pre></div><p>File structure</p><div class="language-txt" data-highlighter="prismjs" data-ext="txt" data-title="txt"><pre><code><span class="line">- /my-repos</span>
<span class="line">  - repman.yaml</span>
<span class="line">  - /my-repo-1</span>
<span class="line">  - /my-repo-2</span>
<span class="line"></span></code></pre></div><h2 id="root-directory" tabindex="-1"><a class="header-anchor" href="#root-directory"><span>Root directory</span></a></h2><p>File structure</p><div class="language-txt" data-highlighter="prismjs" data-ext="txt" data-title="txt"><pre><code><span class="line">- /my-repos-collection-1</span>
<span class="line">- /my-repos-collection-2</span>
<span class="line">- /repman-configs</span>
<span class="line">  - repman-1.yaml</span>
<span class="line">  - repman-2.yaml</span>
<span class="line"></span></code></pre></div><p><code>/repman-configs/repman-1.yaml</code></p><div class="language-yaml" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token key atrule">root_dir</span><span class="token punctuation">:</span> ./my<span class="token punctuation">-</span>repos<span class="token punctuation">-</span>collection<span class="token punctuation">-</span><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">repositories</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>repo<span class="token punctuation">-</span><span class="token number">1</span></span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> git@github.com<span class="token punctuation">:</span>neilveil/repman.git</span>
<span class="line">    <span class="token key atrule">branch</span><span class="token punctuation">:</span> master</span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>repo<span class="token punctuation">-</span><span class="token number">2</span></span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> git@github.com<span class="token punctuation">:</span>neilveil/repman.git</span>
<span class="line">    <span class="token key atrule">branch</span><span class="token punctuation">:</span> master</span>
<span class="line"></span></code></pre></div><p>Run <code>repman-1.yaml</code> from <code>/repman-configs</code> directory</p><div class="language-bash" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token assign-left variable">REPMAN_CONFIG_FILE</span><span class="token operator">=</span>repman-1.yaml repman</span>
<span class="line"></span></code></pre></div>`,17)]))}const i=n(t,[["render",l],["__file","index.html.vue"]]),r=JSON.parse('{"path":"/docs/","title":"Docs","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Configuration File","slug":"configuration-file","link":"#configuration-file","children":[]},{"level":2,"title":"Run Repman","slug":"run-repman","link":"#run-repman","children":[]},{"level":2,"title":"Root directory","slug":"root-directory","link":"#root-directory","children":[]}],"git":{},"filePathRelative":"docs/index.md"}');export{i as comp,r as data};
