export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/home/runner/work/repman/repman/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Home"} }],
  ["/docs/", { loader: () => import(/* webpackChunkName: "docs_index.html" */"/home/runner/work/repman/repman/docs/.vuepress/.temp/pages/docs/index.html.js"), meta: {"title":"Docs"} }],
  ["/installation/", { loader: () => import(/* webpackChunkName: "installation_index.html" */"/home/runner/work/repman/repman/docs/.vuepress/.temp/pages/installation/index.html.js"), meta: {"title":"Installation"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/home/runner/work/repman/repman/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);
