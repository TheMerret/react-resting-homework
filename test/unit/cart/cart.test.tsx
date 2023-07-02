import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import React from "react";

import { Application } from "../../../src/client/Application";
import { initStore } from "../../../src/client/store";

import { CartApi, ExampleApi } from "../../../src/client/api";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";

const products = [
  {
    id: 0,
    name: "Gorgeous Pants",
    description:
      "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
    price: 158,
    color: "black",
    material: "Concrete",
  },
  {
    id: 1,
    name: "Small Tuna",
    description:
      "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design",
    price: 437,
    color: "gold",
    material: "Steel",
  },
];

const basename = "/hw/store";

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe("test cart", () => {
  beforeEach(() => {
    store.dispatch({
      type: "ADD_TO_CART",
      product: products[0],
    });
    store.dispatch({
      type: "ADD_TO_CART",
      product: products[0],
    });
    store.dispatch({
      type: "ADD_TO_CART",
      product: products[1],
    });
  });
  afterEach(() => {
    store.dispatch({
      type: "CLEAR_CART",
    });
  });
  it("in navbar should be showed unique products count", async () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const nav = container.querySelector("nav .navbar-nav");
    expect(nav).toHaveTextContent("2");
  });
  it("should show table with products", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const table = container.querySelector("table");
    expect(table).toHaveTextContent(products[0].name);
    expect(table).toHaveTextContent(products[1].name);
  });
  it("should show product's name, price, amount, totalPrice and cartTotal", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const counts = { [products[0].id]: 2, [products[1].id]: 1 };
    for (const product of products) {
      for (const prop of ["name", "price"]) {
        const value = product[prop as keyof typeof product];
        expect(container).toHaveTextContent(`${value}`);
      }
      expect(container).toHaveTextContent(`${counts[product.id]}`);
      expect(container).toHaveTextContent(
        `$${counts[product.id] * product.price}`
      );
    }
    const cartTotal = products.reduce(
      (acc, p) => acc + counts[p.id] * p.price,
      0
    );
    expect(container).toHaveTextContent(`$${cartTotal}`);
  });
  it("should clear cart after click on clear button", async () => {
    const { container, getByText } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const button = getByText("Clear shopping cart");
    fireEvent.click(button);
    expect(cart.getState()).toEqual({});
  });
  it("should clear cart after click on clear button", async () => {
    store.dispatch({
      type: "CLEAR_CART",
    });
    const { container, getByText } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const anchor = getByText("catalog") as HTMLAnchorElement;
    expect(anchor.getAttribute("href")).toBe("/catalog");
  });
});
