import jsdom from "jsdom-global";
import React from "react";
import ReactDOM from "react-dom";
import { AtomicVariable } from "../AtomicVariable";
import { useValue } from "./useValue";
import { expect, use, should } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

should();
use(sinonChai);
jsdom();

const TestComponent = ({ variable }: { variable: AtomicVariable<any> }) => {
  const value = useValue(variable);
  return <p>{value}</p>;
};

describe("useValue", () => {
  it("should render the initial value of the hook if the value is never updated", () => {
    const variable = new AtomicVariable(0);

    const container = document.createElement("div");
    ReactDOM.render(<TestComponent variable={variable} />, container);

    expect(container.textContent).to.equal("0");
  });

  it("should render the updated value of the hook if the value is updated", () => {
    const variable = new AtomicVariable(0);

    const container = document.createElement("div");
    ReactDOM.render(<TestComponent variable={variable} />, container);

    ReactDOM.flushSync(() => {
      variable.set(1);
    });

    expect(container.textContent).to.equal("1");
  });
});
