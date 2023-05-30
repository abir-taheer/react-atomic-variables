import { expect, use, should } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { ListenerStore } from "./ListenerStore";

should();
use(sinonChai);
describe("ListenerStore", () => {
  describe("constructor", () => {
    it("should set the listeners to an empty array", () => {
      const listeners = new ListenerStore();

      expect(listeners.listeners).to.deep.equal([]);
    });
  });

  describe("#addListener", () => {
    it("should add the listener to the listeners array", () => {
      const listeners = new ListenerStore();

      const listener = () => {};

      listeners.addListener(listener);

      expect(listeners.listeners).to.deep.equal([listener]);
    });
  });

  describe("#removeListener", () => {
    it("should remove the listener from the listeners array", () => {
      const listeners = new ListenerStore();

      const fn = sinon.spy();

      listeners.addListener(fn);

      expect(listeners.listeners).to.deep.equal([fn]);

      listeners.removeListener(fn);
      listeners.emit(1);

      expect(listeners.listeners).to.deep.equal([]);
      expect(fn).to.not.have.been.called;
    });
  });

  describe("#emit", () => {
    it("should call each listener with the value", () => {
      const listeners = new ListenerStore<number>();

      const fn1 = sinon.spy();
      const fn2 = sinon.spy();

      listeners.addListener(fn1);
      listeners.addListener(fn2);

      listeners.emit(1);

      expect(fn1).to.have.been.calledOnceWith(1);
      expect(fn2).to.have.been.calledOnceWith(1);

      listeners.emit(2);
      expect(fn1).to.have.been.calledTwice;
      expect(fn2).to.have.been.calledTwice;

      expect(fn1).to.have.been.calledWith(2);
      expect(fn2).to.have.been.calledWith(2);
    });
  });
});
