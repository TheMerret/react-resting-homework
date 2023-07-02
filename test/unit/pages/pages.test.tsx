import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';

import { Application } from '../../../src/client/Application';
import { initStore } from '../../../src/client/store';
import { CartApi, ExampleApi } from '../../../src/client/api';

jest.mock('../../../src/client/pages/Cart', () => ({
  Cart: () => {
    return <div data-testid="cart" />;
  },
}));
jest.mock('../../../src/client/pages/Catalog', () => ({
  Catalog: () => {
    return <div data-testid="catalog" />;
  },
}));
jest.mock('../../../src/client/pages/Contacts', () => ({
  Contacts: () => {
    return <div data-testid="contacts" />;
  },
}));
jest.mock('../../../src/client/pages/Delivery', () => ({
  Delivery: () => {
    return <div data-testid="delivery" />;
  },
}));
jest.mock('../../../src/client/pages/Home', () => ({
  Home: () => {
    return <div data-testid="home" />;
  },
}));
jest.mock('../../../src/client/pages/Product', () => ({
  Product: () => {
    return <div data-testid="product" />;
  },
}));

const basename = '/hw/store';

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe('test pages exists', () => {
  for (const [componentName, path, testId] of [
    ['Home', '/', 'home'],
    ['Catalog', '/catalog', 'catalog'],
    ['Product', '/catalog/:id', 'product'],
    ['Delivery', '/delivery', 'delivery'],
    ['Contacts', '/contacts', 'contacts'],
    ['Cart', '/cart', 'cart'],
  ]) {
    it(`should render ${componentName} on '${path}' route`, async () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={[path]}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>
      );

      expect(getByTestId(testId)).toBeInTheDocument();
    });
  }
});
