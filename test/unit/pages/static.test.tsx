import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { Home } from '../../../src/client/pages/Home';
import { Delivery } from '../../../src/client/pages/Delivery';
import { Contacts } from '../../../src/client/pages/Contacts';

describe('test pages have static content', () => {
  for (const component of [Home, Delivery, Contacts])
    test(`${component.name} is static`, async () => {
      expect(() => render(React.createElement(Home))).not.toThrow(
        'could not find react-redux context value; please ensure the component is wrapped in a <Provider>'
      );
    });
});
