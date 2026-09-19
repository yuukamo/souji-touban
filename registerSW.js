// ホーム画面から起動したときにオフラインでも開けるようにする。
// パスはこのファイルの場所からの相対にしてあるので、リポジトリ名が変わってもそのまま動く。
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("sw.js", document.baseURI))
      .catch(err => console.warn("Service Worker の登録に失敗しました:", err));
  });
}
