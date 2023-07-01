import { expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import React from "react";

import { Application } from "../../../src/client/Application";
import { initStore } from "../../../src/client/store";

import { CartApi, ExampleApi } from "../../../src/client/api";
import { Provider } from "react-redux";

const basename = "/hw/store";

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

const application = (
  <BrowserRouter basename={basename}>
    <Provider store={store}>
      <Application />
    </Provider>
  </BrowserRouter>
);

it("navbar contains links to pages", async () => {
  const LINKS = [
    "http://localhost/hw/store/catalog",
    "http://localhost/hw/store/delivery",
    "http://localhost/hw/store/contacts",
    "http://localhost/hw/store/cart",
  ];

  const { container } = render(application);
  Array.from(container.querySelectorAll("nav .nav-link")).forEach((a: any) => {
    expect(LINKS).toContain(a.href);
  });
});

it("shop name is link to home page", async () => {
  const LINK = "http://localhost/hw/store/";

  const { container } = render(application);
  const shopName: HTMLAnchorElement = container.querySelector("a.navbar-brand")!;
  expect(shopName.href).toEqual(LINK);
});