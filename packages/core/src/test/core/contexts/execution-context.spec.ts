import { ExecutionContext } from "../../../../src/contexts";

describe('ExecutionContextHost', () => {
  let contextHost: ExecutionContext;

  const args = ['eventName', 1, 'test', 'test2', 'test3'], constructorRef = { test: 'test' }, callback = () => null;

  beforeEach(() => {
    contextHost = new ExecutionContext(
      args,
      constructorRef as any,
      callback,
    );
  });

  describe('getEventName', () => {
    it('should return eventName', () => {
      expect(contextHost.getEventName()).toEqual(args[0]);
    });
  });

  describe('getSource', () => {
    it('should return source', () => {
      expect(contextHost.getSource()).toEqual(args[1]);
    });
  });

  describe('getClass', () => {
    it('should return constructorRef', () => {
      expect(contextHost.getClass()).toEqual(constructorRef);
    });
  });

  describe('getHandler', () => {
    it('should return handler', () => {
      expect(contextHost.getHandler()).toEqual(callback);
    });
  });

  describe('getArgs', () => {
    it('should return args', () => {
      expect(contextHost.getArgs()).toEqual(args);
    });
  });

  describe('getArgByIndex(0)', () => {
    it('should return argument by index', () => {
      expect(contextHost.getArgByIndex(0)).toEqual(args[0]);
    });
  });

  describe('getArgByIndex(3)', () => {
    it('should return argument by index', () => {
      expect(contextHost.getArgByIndex(3)).toEqual(args[3]);
    });
  });
});