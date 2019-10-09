/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface EventSource {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: {}): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: {}): void;
}
export interface PostMessageWithOrigin {
    postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
}
export interface Endpoint extends EventSource {
    postMessage(message: any, transfer?: Transferable[]): void;
    start?: () => void;
}
export declare const enum WireValueType {
    RAW = 0,
    PROXY = 1,
    THROW = 2,
    HANDLER = 3
}
export interface RawWireValue {
    id?: string;
    type: WireValueType.RAW;
    value: {};
}
export interface HandlerWireValue {
    id?: string;
    type: WireValueType.HANDLER;
    name: string;
    value: {};
}
export declare type WireValue = RawWireValue | HandlerWireValue;
export declare type MessageID = string;
export declare const enum MessageType {
    GET = 0,
    SET = 1,
    APPLY = 2,
    CONSTRUCT = 3,
    ENDPOINT = 4
}
export interface GetMessage {
    id?: MessageID;
    type: MessageType.GET;
    path: string[];
}
export interface SetMessage {
    id?: MessageID;
    type: MessageType.SET;
    path: string[];
    value: WireValue;
}
export interface ApplyMessage {
    id?: MessageID;
    type: MessageType.APPLY;
    path: string[];
    argumentList: WireValue[];
}
export interface ConstructMessage {
    id?: MessageID;
    type: MessageType.CONSTRUCT;
    path: string[];
    argumentList: WireValue[];
}
export interface EndpointMessage {
    id?: MessageID;
    type: MessageType.ENDPOINT;
}
export declare type Message = GetMessage | SetMessage | ApplyMessage | ConstructMessage | EndpointMessage;
