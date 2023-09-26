/**
 * @FileName : ExceptionHelper.js
 * @Description : 예외처리 클래스
 * @Author : Lee Kwang-Ho (leekh4232@gmail.com)
 */
class Exception extends Error {
    #code;
    #name;

    constructor(code, message) {
        super(message);
        this.#name = this.constructor.name;
        this.#code = code;
    }

    get code() {
        return this.#code;
    }

    get name() {
        return this.#name;
    }
}

class BadRequestException extends Exception {
    constructor(msg = "잘못된 요청 입니다.") {
        super(400, msg);
    }
}

class UnauthorizedException extends Exception {
    constructor(msg = "접근 권한이 없습니다.") {
        super(401, msg);
    }
}

class ForbiddenException extends Exception {
    constructor(msg = "잘못된 접근 입니다.") {
        super(403, msg);
    }
}

class PageNotFoundException extends Exception {
    constructor(msg = "페이지를 찾을 수 없습니다.") {
        super(404, msg);
    }
}

class RuntimeException extends Exception {
    constructor(msg = "요청을 처리하는데 실패했습니다.") {
        super(500, msg);
    }
}

class FileUploadException extends Exception {
    constructor(msg = "파일을 업로드 하는데 실패했습니다.") {
        super(500, msg);
    }
}

module.exports = { BadRequestException, UnauthorizedException, ForbiddenException, PageNotFoundException, RuntimeException, FileUploadException };
