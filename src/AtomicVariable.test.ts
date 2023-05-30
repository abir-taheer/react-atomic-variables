import { expect, use, should } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import { AtomicVariable } from "./index";

should();
use(sinonChai);
describe("AtomicVariable", () => {
  describe("constructor", () => {
    it("should set the value of the variable", () => {
      const variable = new AtomicVariable(1);

      expect(variable.getValue()).to.equal(1);
    });
  });

  describe("#getValue", () => {
    const variable = new AtomicVariable(1);

    it("should return the value of the variable", () => {
      expect(variable.getValue()).to.eq(1);

      variable.set(2);

      expect(variable.getValue()).to.eq(2);
    });
  });

  describe("#set", () => {
    const variable = new AtomicVariable(1);

    it("should set the value of the variable", () => {
      variable.set(2);

      expect(variable.getValue()).to.eq(2);
    });

    it("should trigger the listeners", () => {
      const callback = sinon.spy();

      variable.subscribe(callback);
      variable.set(3);

      expect(callback).to.have.been.calledOnceWith(3);
    });
  });

  describe("#subscribe", () => {
    it("should call the callback function every time the value changes", () => {
      const variable = new AtomicVariable(1);

      const callback = sinon.spy();

      variable.subscribe(callback);

      variable.set(2);
      expect(callback).to.have.been.calledWith(2);

      variable.set(3);
      expect(callback).to.have.been.calledWith(3);

      expect(callback).to.have.been.calledTwice;
    });

    it("should return a function that unsubscribes the callback", () => {
      const variable = new AtomicVariable(1);

      const callback = sinon.spy();

      const unsubscribe = variable.subscribe(callback);

      variable.set(2);
      expect(callback).to.have.been.calledWith(2);

      unsubscribe();

      variable.set(3);
      expect(callback).to.have.been.calledOnce;
    });
  });
});
