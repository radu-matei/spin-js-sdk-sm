import { IncomingRequest, OutputStream } from './types/wasi-http';
export declare class SimpleHTTP {
    constructor();
    handleRequest(req: HttpRequest, res: ResponseBuilder): Promise<void>;
    handle(request: IncomingRequest, response_out: OutputStream): Promise<void>;
}
export interface HttpRequest {
    method: string;
    uri: string;
    headers: Headers;
    body?: Uint8Array;
}
export type BodyInit = BufferSource | URLSearchParams | ReadableStream<Uint8Array> | USVString;
export type USVString = string | ArrayBuffer | ArrayBufferView;
export declare class ResponseBuilder {
    headers: Headers;
    private hasWrittenHeaders;
    private hasSentResponse;
    private responseOut;
    private statusCode;
    private responseBody;
    private responseStream;
    private response;
    constructor(responseOut: OutputStream);
    status(code: number): this;
    getStatus(): number;
    set(arg1: string | {
        [key: string]: string;
    }, arg2?: string): this;
    send(value?: BodyInit): void;
    write(value: BodyInit): void;
    end(): void;
}
