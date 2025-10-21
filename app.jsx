import { jsxDEV } from "react/jsx-dev-runtime";
const { useEffect, useMemo, useRef, useState } = React;
const room = new WebsimSocket();
function useRecords() {
  const list = React.useSyncExternalStore(
    room.collection("file_v1").subscribe,
    room.collection("file_v1").getList
  );
  return list;
}
function formatBytes(n) {
  if (!n && n !== 0) return "";
  const k = 1024, sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${(n / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}
function Uploader({ onUploading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [queue, setQueue] = useState([]);
  async function handleFiles(fileList) {
    const files = Array.from(fileList);
    const items = files.map((f) => ({ id: crypto.randomUUID(), name: f.name, progress: 0, status: "queued", error: null, file: f }));
    setQueue((prev) => [...items, ...prev]);
    onUploading?.(true);
    for (const item of items) {
      let prog = 0;
      const tick = setInterval(() => {
        prog = Math.min(95, prog + 5);
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, progress: prog } : q));
      }, 80);
      try {
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: "uploading" } : q));
        const url = await websim.upload(item.file);
        clearInterval(tick);
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, progress: 100, status: "saving" } : q));
        await room.collection("file_v1").create({
          name: item.file.name,
          size: item.file.size,
          type: item.file.type,
          url
        });
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: "done" } : q));
      } catch (e) {
        console.error("Upload error", e);
        clearInterval(tick);
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: "error", error: e?.message || "Upload failed" } : q));
      }
    }
    onUploading?.(false);
    setTimeout(() => setQueue((prev) => prev.filter((i) => i.status === "uploading" || i.status === "queued")), 1500);
  }
  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }
  useEffect(() => {
    function onPaste(e) {
      const items = e.clipboardData?.files;
      if (items && items.length) handleFiles(items);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "uploader", children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `dropzone ${dragOver ? "dragover" : ""}`,
        onDragOver: (e) => {
          e.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        onDrop,
        children: [
          /* @__PURE__ */ jsxDEV("p", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "Drag & drop" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 85,
              columnNumber: 12
            }, this),
            " files here, or paste from clipboard"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 85,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "actions", children: [
            /* @__PURE__ */ jsxDEV("button", { className: "primary", onClick: () => inputRef.current?.click(), children: "Choose files" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 87,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "badge", children: "Paste supported" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 88,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 86,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              ref: inputRef,
              className: "hidden-input",
              type: "file",
              multiple: true,
              onChange: (e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = "";
              }
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 90,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 79,
        columnNumber: 7
      },
      this
    ),
    queue.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "list", children: queue.map((q) => /* @__PURE__ */ jsxDEV("div", { className: "item", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "file-row", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "file-name", children: q.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 107,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "file-type", children: q.status }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 108,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 106,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "progress", children: /* @__PURE__ */ jsxDEV("span", { style: { "--w": `${q.progress}%` } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 110,
        columnNumber: 41
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 110,
        columnNumber: 15
      }, this),
      q.error && /* @__PURE__ */ jsxDEV("div", { style: { color: "#b91c1c", fontSize: 13 }, children: q.error }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 111,
        columnNumber: 27
      }, this)
    ] }, q.id, true, {
      fileName: "<stdin>",
      lineNumber: 105,
      columnNumber: 13
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 103,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 78,
    columnNumber: 5
  }, this);
}
function FileItem({ rec, currentUser }) {
  const me = currentUser?.username === rec.username;
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(rec.url);
    } catch (e) {
      console.error(e);
      alert("Could not copy");
    }
  }
  async function remove() {
    if (!confirm("Delete this file record?")) return;
    try {
      await room.collection("file_v1").delete(rec.id);
    } catch (e) {
      alert("You can only delete your own records.");
    }
  }
  const created = new Date(rec.created_at);
  return /* @__PURE__ */ jsxDEV("div", { className: "item", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "item-head", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "item-meta", children: [
        /* @__PURE__ */ jsxDEV("img", { className: "avatar", src: `https://images.websim.com/avatar/${rec.username}`, alt: rec.username }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 144,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "name", children: [
          "@",
          rec.username
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 145,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: "\u2022" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 146,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { title: created.toISOString(), children: created.toLocaleString() }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 147,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 143,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "item-actions", children: [
        /* @__PURE__ */ jsxDEV("button", { onClick: () => window.open(rec.url, "_blank"), children: "Open" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 150,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: copyUrl, children: "Copy URL" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 151,
          columnNumber: 11
        }, this),
        me && /* @__PURE__ */ jsxDEV("button", { onClick: remove, children: "Delete" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 152,
          columnNumber: 18
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 149,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 142,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "file-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "file-name", children: rec.name }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 156,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "file-type", children: rec.type || "unknown" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 157,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "file-size", children: formatBytes(rec.size) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 158,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 155,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "url", title: rec.url, children: rec.url }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 160,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 141,
    columnNumber: 5
  }, this);
}
function App() {
  const records = useRecords();
  const [currentUser, setCurrentUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    (async () => setCurrentUser(await window.websim.getCurrentUser()))();
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "title", children: "Websim File Uploader" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 177,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "subtitle", children: "Upload files to get a shareable URL. Records are persisted." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 178,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 176,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Uploader, { onUploading: setUploading }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 181,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "list", children: records.length === 0 && !uploading ? /* @__PURE__ */ jsxDEV("div", { className: "empty", children: "No files yet. Upload above to create your first record." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 185,
      columnNumber: 11
    }, this) : records.map((rec) => /* @__PURE__ */ jsxDEV(FileItem, { rec, currentUser }, rec.id, false, {
      fileName: "<stdin>",
      lineNumber: 190,
      columnNumber: 13
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 183,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 175,
    columnNumber: 5
  }, this);
}
ReactDOM.createRoot(document.getElementById("app")).render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 198,
  columnNumber: 60
}));
