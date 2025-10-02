// Polyfill Web APIs for jsdom environment
// This file runs before any test files or modules are loaded
const { TextEncoder, TextDecoder } = require('util')
const { ReadableStream, TransformStream } = require('stream/web')
const { MessageChannel, MessagePort } = require('worker_threads')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.MessageChannel = MessageChannel
global.MessagePort = MessagePort
