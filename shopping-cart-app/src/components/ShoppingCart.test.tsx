import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShoppingCart } from './ShoppingCart';

describe('ShoppingCart Component', () => {
  it('should render initial empty state correctly', () => {
    render(<ShoppingCart />);
    
    expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('should add a new item to the cart when inputs are valid', async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const nameInput = screen.getByRole('textbox', { name: /product name/i });
    const priceInput = screen.getByRole('spinbutton', { name: /product price/i });
    const addButton = screen.getByRole('button', { name: /add to cart/i });

    await user.type(nameInput, 'Wireless Mouse');
    await user.type(priceInput, '25.50');
    await user.click(addButton);

    // Verify empty state message is gone and item appears
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();
  });

  it('should not add an item if name or price is missing', async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('should remove an item from the cart', async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const nameInput = screen.getByRole('textbox', { name: /product name/i });
    const priceInput = screen.getByRole('spinbutton', { name: /product price/i });
    const addButton = screen.getByRole('button', { name: /add to cart/i });

    await user.type(nameInput, 'Keyboard');
    await user.type(priceInput, '45');
    await user.click(addButton);

    expect(screen.getByText('Keyboard')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    // FIX: The cart is empty now, so this text SHOULD be in the document
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByText('Keyboard')).not.toBeInTheDocument();
  });

  it('should update item quantity and recalculate summary metrics correctly', async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const nameInput = screen.getByRole('textbox', { name: /product name/i });
    const priceInput = screen.getByRole('spinbutton', { name: /product price/i });
    const addButton = screen.getByRole('button', { name: /add to cart/i });

    await user.type(nameInput, 'Headphones');
    await user.type(priceInput, '100');
    await user.click(addButton);

    // Initial Subtotal: $100.00, Discount (10%): $10.00, Tax (8% of 90): $7.20, Total: $97.20
    expect(screen.getByText(/subtotal: \$100\.00/i)).toBeInTheDocument();

    const quantityInput = screen.getByRole('spinbutton', { name: /quantity for headphones/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    // Subtotal should update to $200.00
    expect(screen.getByText(/subtotal: \$200\.00/i)).toBeInTheDocument();
  });

  it('should clear all items when Clear Cart button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    const nameInput = screen.getByRole('textbox', { name: /product name/i });
    const priceInput = screen.getByRole('spinbutton', { name: /product price/i });
    const addButton = screen.getByRole('button', { name: /add to cart/i });

    await user.type(nameInput, 'Notebook');
    await user.type(priceInput, '10');
    await user.click(addButton);

    expect(screen.getByText('Notebook')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear cart/i });
    await user.click(clearButton);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});