/**
 * Backend Server Core
 *
 * Express 기반 백엔드 서버 본체.
 * 이 파일을 루트 디렉토리의 app.js에서 참조하여 백엔드를 가동한다.
 *
 * author : Lee Kwang-Ho (leekh4232@gmail.com)
 */

/*----------------------------------------------------------
 * 1) 패키지 참조
 *----------------------------------------------------------*/
const https = require("https");
const fs = require("fs");
const {resolve, join} = require("path");
const express = require("express");
const userAgent = require("express-useragent");
const serveStatic = require("serve-static");
const serveFavicon = require("serve-favicon");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fsFileTree = require("fs-file-tree");

/*-----------------------------------------------------------
 * 2) Express 객체 생성 및 Helper 로드
 *----------------------------------------------------------*/
const app = express();

/*----------------------------------------------------------
 * 3) 미들웨어 연결
 *----------------------------------------------------------*/
// POST 요청 처리 (Express 4.16.0 이상 버전부터 body-parser 패키지가 내장되어 있음)
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(userAgent.express());

app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));

app.use(cookieParser(process.env.ENCRYPT_KEY));

app.use(serveFavicon(process.env.FAVICON_PATH));
app.use("/", serveStatic(process.env.PUBLIC_PATH));

app.use(
    fileUpload({
        limits: { fileSize: process.env.UPLOAD_FILE_SIZE_LIMIT },
        useTempFiles: true,
        tempFileDir: process.env.UPLOAD_TEMP_DIR,
        createParentPath: true,
        debug: false,
    })
);

app.use(
    expressSession({
        secret: process.env.ENCRYPT_KEY,
        resave: false,
        saveUninitialized: false
    })
);

app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
        credentials: true,
    })
);

/*----------------------------------------------------------
 * 4) 라우터 설정
 *----------------------------------------------------------*/
const router = express.Router();
app.use(router);

// `controllers` 디렉토리 내의 모든 컨트롤러를 불러와서 라우터에 연결
const currentPath = resolve(__dirname);
const pathLen = currentPath.length;
const controllerPath = join(currentPath, "controllers");
const controllers = fsFileTree.sync(controllerPath);

function initController(con) {
    for (let key in con) {
        if (key.indexOf(".js") > -1) {
            const item = con[key];
            const js = item.path.replace(pathLen, ".");
            console.log(js);
            app.use(process.env.BACKEND_BASE_PATH, require(js)(app));
        } else {
            initController(con[key]);
        }
    }
}

initController(controllers);

/*----------------------------------------------------------
 * 5) 설정한 내용을 기반으로 서버 구동 시작
 *----------------------------------------------------------*/
const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH);
const certificate = fs.readFileSync(process.env.SSL_CERT_KEY_PATH);
const options = {
    key: privateKey,
    cert: certificate
};

const httpsServer = https.createServer(options, app);
httpsServer.listen(process.env.PORT, function () {
    console.log("HTTPS server listening on port " + process.env.PORT);
});

process.on("exit", function () {
    logger.debug("Server is shutdown");
});

process.on("SIGINT", () => {
    process.exit();
});

module.exports = app;