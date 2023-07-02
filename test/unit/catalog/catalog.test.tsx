import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';

import { Application } from '../../../src/client/Application';
import { initStore } from '../../../src/client/store';
import { CartApi, ExampleApi } from '../../../src/client/api';

const catalogBody = [0, 1, 2, 3, 4, 5].map((x) => ({
  id: x,
  name: x,
  price: x,
}));
const productBody = {
  id: 0,
  name: 'Awesome Mouse',
  description:
    'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
  price: 625,
  color: 'cyan',
  material: 'Fresh',
};

const basename = '/hw/store';

const server = setupServer(
  rest.get(`http://localhost${basename}/api/products`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(catalogBody));
  }),
  rest.get(`http://localhost${basename}/api/products/0`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(productBody));
  })
);

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('test catalog', () => {
  test('should shows products got from server', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    await screen.findByText(/\$0/i);
    const ids = Array.from(container.querySelectorAll('.card-body h5')).map(
      (x) => +x.innerHTML
    );
    for (const id of [0, 1, 2, 3, 4, 5]) {
      expect(ids).toContain(id);
    }
  });
  test('should shows product card with title, price and link', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    await screen.findByText(/\$0/i);
    const card = container.querySelector('.card[data-testid="0"]')!;
    const title = card.querySelector('.card-title')?.textContent;
    expect(title).toBe('0');
    const price = card.querySelector('.card-text')?.textContent;
    expect(price).toBe('$0');
    const link = card.querySelector<HTMLAnchorElement>('a.card-link')?.href!;
    expect(new URL(link).pathname).toBe(`/catalog/0`);
  });
  test('should shows message if product already added to cart', async () => {
    store.dispatch({
      type: 'ADD_TO_CART',
      product: {
        description: '0',
        material: '0',
        color: '0',
        id: 0,
        name: '0',
        price: 0,
      },
    });
    const { container } = render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    await screen.findByText(/\$0/i);
    const card = container.querySelector('.card[data-testid="0"]')!;
    expect(card).toHaveTextContent('Item in cart');
    store.dispatch({
      type: 'CLEAR_CART',
    });
  });
});

describe('test product page', () => {
  test('should shows product card with title, description, button, color, material', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/catalog/0']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    await screen.findByText('Awesome Mouse');
    const title = container.querySelector(
      'h1.ProductDetails-Name'
    )?.textContent;
    expect(title).toBe(productBody.name);
    const description = container.querySelector(
      'p.ProductDetails-Description'
    )?.textContent;
    expect(description).toBe(productBody.description);
    const price = container.querySelector(
      'p.ProductDetails-Price'
    )?.textContent;
    expect(price).toBe(`$${productBody.price}`);
    const buttonContent =
      container.querySelector('button.btn-lg')?.textContent;
    expect(buttonContent).toBe('Add to Cart');
    const color = container.querySelector(
      'dd.ProductDetails-Color'
    )?.textContent;
    expect(color).toBe(productBody.color);
    const material = container.querySelector(
      'dd.ProductDetails-Material'
    )?.textContent;
    expect(material).toBe(productBody.material);
  });
  test('should shows message if product already added to cart', async () => {
    store.dispatch({
      type: 'ADD_TO_CART',
      product: productBody,
    });
    const { container } = render(
      <MemoryRouter initialEntries={['/catalog/0']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    await screen.findByText('Awesome Mouse');
    expect(container).toHaveTextContent('Item in cart');
    store.dispatch({
      type: 'CLEAR_CART',
    });
  });
  test('should increment product count after another click on add to cart', async () => {
    store.dispatch({
      type: 'ADD_TO_CART',
      product: productBody,
    });
    render(
      <MemoryRouter initialEntries={['/catalog/0']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const button = await screen.findByText('Add to Cart');
    fireEvent.click(button);
    const cartState = cart.getState();
    expect(cartState[productBody.id].count).toBe(2);
    store.dispatch({
      type: 'CLEAR_CART',
    });
  });
});
