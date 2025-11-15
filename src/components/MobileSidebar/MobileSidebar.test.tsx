import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import styles from './MobileSidebar.module.scss';
import MobileSidebar from './MobileSidebar';

jest.mock('../SidebarNav', () => () => <div data-testid="SidebarNavTest">SidebarNav</div>);

describe('Home', () => {
  /** Base props for MobileSidebar **/
  const baseProps = {};

  /**
   * @test
   * Renders the MobileSidebar component without throwing an error
   * and checks if the MobileSidebarTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<MobileSidebar {...baseProps} />);
    expect(screen.getByTestId('MobileSidebarTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the MobileSidebar component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<MobileSidebar {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the MobileSidebar component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<MobileSidebar {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('closes sidebar when overlay is clicked', () => {
    render(<MobileSidebar />);

    // open sidebar
    const hamburgerBtn = document.querySelector('.hamburgerBtn') as HTMLButtonElement;
    fireEvent.click(hamburgerBtn);

    // overlay should now appear
    const overlay = document.querySelector(`.${styles.overlay}`) as HTMLDivElement;
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay);

    // sidebar should close
    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).not.toContain('show');
  });

  it('closes sidebar when overlay is clicked', () => {
    render(<MobileSidebar />);

    // open sidebar
    const hamburgerBtn = screen.getAllByRole('button')[0];
    fireEvent.click(hamburgerBtn);

    // overlay should now appear
    const overlay = document.querySelector(`.${styles.overlay}`) as HTMLDivElement;
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay);

    // sidebar should close
    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).not.toContain('show');

    expect(document.body.style.overflow).toBe('');
  });

  it('closes sidebar when close button is clicked', () => {
    render(<MobileSidebar />);

    // open sidebar
    const hamburgerBtn = screen.getAllByRole('button')[0];
    fireEvent.click(hamburgerBtn);

    // close button exists only after opening
    const closeBtn = document.querySelector('.closeBtn') as HTMLButtonElement;
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar.className).not.toContain('show');
    expect(document.body.style.overflow).toBe('');
  });
});
