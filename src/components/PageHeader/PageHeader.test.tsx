import { render, screen } from '@testing-library/react';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  it('renders the title as the page heading with its description', () => {
    render(<PageHeader title="Agency profile" description="Public identity" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Agency profile' })).toBeInTheDocument();
    expect(screen.getByText('Public identity')).toBeInTheDocument();
  });

  it('renders the actions it is given', () => {
    render(<PageHeader title="Tours" actions={<button type="button">New tour</button>} />);
    expect(screen.getByRole('button', { name: 'New tour' })).toBeInTheDocument();
  });

  it('leaves out the description and actions when not given', () => {
    const { container } = render(<PageHeader title="Customers" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
