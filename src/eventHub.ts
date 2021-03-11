import mitt, { Emitter, EventType, Handler } from 'mitt';

const emitter: Emitter = mitt();

export default {
  $on: <T = any>(type: EventType, handler: Handler<T>) => emitter.on(type, handler),
  $off: <T = any>(type: EventType, handler: Handler<T>) => emitter.off(type, handler),
  $emit: <T = any>(type: EventType, event?: T) => emitter.emit(type, event)
};
