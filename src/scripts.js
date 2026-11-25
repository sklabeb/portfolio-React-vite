const loaded = new Map();

export async function loadScripts(urls) {
  for (const url of urls) {
    if (!loaded.has(url)) {
      loaded.set(url, new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      }));
    }
    await loaded.get(url);
  }
}
