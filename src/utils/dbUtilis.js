// import { remote } from "electron";
// import path from "path";
// import process from "process";
import { save } from "save-file";
import toBuffer from "blob-to-buffer";
import { Book } from "epubjs";
// import fileUrl from "file-url";
// import * as Vibrant from "node-vibrant";
// 存储书籍封面
function storeCover(book, path, cb) {
  book.loaded.cover.then((cover) => {
    if (!cover) {
      cb(false);
      return;
    }
    try {
      book.archive.getBlob(cover).then((blb) => {
        toBuffer(blb, (err, buffer) => {
          if (err) throw err;
          save(buffer, path).then(() => {
            if (cb) {
              cb(true);
            }
          });
        });
      });
    } catch (err) {
      console.error(err);
    }
  });
}

async function parshToc(book) {
  try {
    const { toc } = book.navigation;
    // debugger;
    const { spine } = book;
    const validateHref = (href) => {
      if (href.startsWith("..")) {
        href = href.substring(2);
      }
      if (href.startsWith("/")) {
        href = href.substring(1);
      }
      return href;
    };
    const getSpineComponent = (href) => {
      return href.split("#")[0];
    };
    const getPositonComponent = (href) => {
      return href.split("#")[1];
    };

    const tocTree = [];

    /**
     * recursively go through toc and parsh it
     * @param {toc} toc
     * @param {parrent} parrent
     */
    const createTree = async (toc, parrent) => {
      for (let i = 0; i < toc.length; i += 1) {
        // get clean href
        const href = validateHref(toc[i].href);

        // get spin and elementId part from href
        const spineComponent = getSpineComponent(href);
        const positonComponent = getPositonComponent(href);

        // get spinItem from href
        const spineItem = spine.get(spineComponent);

        // load spin item
        await spineItem.load(book.load.bind(book)).then(() => {
          // debugger;
          // get element by positionComponent which is basically elementId
          const el = spineItem.document.getElementById(positonComponent);
          // get cfi from element
          const cfi = spineItem.cfiFromElement(el);
          // get percent from cfi
          const percentage = book.locations.percentageFromCfi(cfi);
          // toc item which has
          parrent[i] = {
            label: toc[i].label.trim(),
            children: [],
            href,
            cfi,
            percentage,
            toc: toc[i],
          };

          // if toc has subitems recursively parsh it
          if (toc[i].subitems) {
            createTree(toc[i].subitems, parrent[i].children);
          }
        });
      }
    };

    await createTree(toc, tocTree);
    return tocTree;
  } catch (e) {
    return null;
  }
}
function generateKey(filePath) {
  if (!filePath || typeof filePath !== "string") {
    return "";
  }
  // eslint-disabled-next-line no-useless-escape
  // eslint-disable-next-line no-useless-escape
  return filePath.replace(/[ \/\.]/g, "");
}

function getInfo(filePath, fileObject, callback) {
  // parameter validation
  //   if (!filePath || typeof filePath !== "string") {
  //     return;
  //   }
  // create a key from path
  const key = generateKey(fileObject.name);
  // file load on file protocol
  //   const uri = fileUrl(filePath);
  const uri = filePath;
  const book = new Book();
  book.open(uri, "binary");
  book.ready
    .then(() => {
      return book.locations.generate();
    })
    .then((locations) => {
      const meta = book.package.metadata;

      const info = {
        id: key,
        title: meta.title,
        author: meta.creator,
        publisher: meta.publisher,
        // path: uri,
        bookmarks: [],
        highlights: [],
        bgColorFromCover: "",
        toc: parshToc(book),
        locations,
      };
      if (callback) {
        callback(info, book);
      }
    });
}
// 添加数据库,先根据getInfo得到书籍信息,之后,storeCover进行存储封面
// function addToDB(file, fileObject, db, cb) {
//   getInfo(file, fileObject, (info, book) => {
//     let key = info.id;
//     info.lastOpen = new Date().getTime();

//     debugger;
//     // return if book is allready registered
//     if (db.has(key)) {
//       if (cb) {
//         cb(info, db);
//       }
//       return;
//     }

//     // if (process.platform === "win32") {
//     //   key = key.split("\\").pop();
//     // }
//     if (window.navigator.platform == "Win32") {
//       key = key.split("\\").pop();
//     }

//     // const coverPath = path.join(
//     //   //   remote.app.getPath("appData"),
//     //   "eplee",
//     //   "cover",
//     //   key
//     // );
//     const coverPath = "info";
//     storeCover(book, coverPath, (isSuccess) => {
//       if (isSuccess) {
//         info.coverPath = fileUrl(coverPath);
//         Vibrant.from(coverPath)
//           .getPalette((err, palette) => {
//             if (err) return;
//             info.bgColorFromCover = palette.DarkVibrant.hex;
//           })
//           .then(() => {
//             db.insert(key, info);
//           })
//           .then(() => {
//             if (cb) {
//               cb(info, db);
//             }
//           });
//       } else {
//         info.bgColorFromCover = "#6d6d6d";
//         db.insert(key, info);

//         if (cb) {
//           cb(info, db);
//         }
//       }
//     });
//   });
// }
export {
  // addToDB,
  storeCover,
  generateKey,
  getInfo,
  parshToc,
};
