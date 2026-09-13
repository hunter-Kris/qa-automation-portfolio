export const demoUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  }
} as const;

export const checkoutCustomer = {
  firstName: 'Taylor',
  lastName: 'Tester',
  postalCode: '10001'
} as const;

export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99'
  }
} as const;
