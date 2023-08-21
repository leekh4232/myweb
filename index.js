/**
 * Fullstack Framework Core - Next.js + Express
 * author : Lee Kwang-Ho
 */
const dev = process.env.NODE_ENV !== "production";
const configFile = dev ? ".env.development" : ".env.production";
const configFilePath = `${__dirname}/${configFile}`;
require("dotenv").config({ path: configFilePath.replace(/\\/g, "/").replace(new RegExp("//"), "/") });

const backend = require("./backend/app");
const next = require("next");

const app = next({ dev });
const handler = app.getRequestHandler();

(async () => {
    try {
        await app.prepare();
        backend.set("trust proxy", true);
        backend.get("*", (req, res) => {
            return handler(req, res);
        });
    } catch (ex) {
        console.error("");
        console.error("--------------------------------------------------");
        console.error(`${ex.name} Error (${ex.number})`);
        console.error(`${ex.message}`);
        console.error(`>>> ${ex.fileName}(Line: ${ex.lineNumber}, Column: ${ex.columnNumber})`);
        console.error("--------------------------------------------------\n");
    }
})();
