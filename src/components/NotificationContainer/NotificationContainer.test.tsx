import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { Notification } from './NotificationContainer';
import NotificationContainer from './NotificationContainer';

describe('Home', () => {
  /** Base props for NotificationContainer **/
  const baseNotification: Notification = {
    id: 1,
    type: 'success',
    title: 'Test Notification',
    message: 'This is a test notification',
    duration: 3000,
    showProgress: true,
    position: 'top-right',
  };

  let removeNotificationMock: jest.Mock;

  beforeEach(() => {
    removeNotificationMock = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const renderContainer = (notifications: Notification[] = [baseNotification]) => {
    return render(
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotificationMock}
      />,
    );
  };

  /**
   * @test
   * Renders the NotificationContainer component without throwing an error
   * and checks if the NotificationContainerTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    renderContainer();
    expect(screen.getByTestId('NotificationContainerTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Captures a snapshot of the NotificationContainer component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = renderContainer();
    expect(asFragment()).toMatchSnapshot();
  });

  it('auto-dismisses notification after duration', () => {
    renderContainer();
    jest.advanceTimersByTime(3000);
    expect(removeNotificationMock).toHaveBeenCalledWith(1);
  });

  it('renders notifications of all types', () => {
    const types: Notification['type'][] = ['success', 'error', 'warning', 'info'];
    types.forEach((type, idx) => {
      renderContainer([{ ...baseNotification, id: idx, type }]);
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      cleanup(); // clear previous notification before next iteration
    });
  });

  it('renders notifications in all positions', () => {
    const positions: Notification['position'][] = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
      'top-center',
    ];
    positions.forEach((position, idx) => {
      renderContainer([{ ...baseNotification, id: idx, position }]);
      expect(screen.getByTestId('NotificationContainerTest')).toBeInTheDocument();
      cleanup();
    });
  });

  it('renders progress bar only if showProgress is true', () => {
    // With progress
    renderContainer();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    cleanup();

    // Without progress
    renderContainer([{ ...baseNotification, showProgress: false }]);
    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('calls removeNotification when close button is clicked', () => {
    renderContainer();
    const closeBtn = screen.getByTestId('notification-close-btn');
    fireEvent.click(closeBtn);
    expect(removeNotificationMock).toHaveBeenCalledWith(1);
  });
});
