import { Bounce, toast } from 'react-toastify';

type NotificationType = 'info' | 'success' | 'error' | 'warning';

interface NotifyParams {
  type: NotificationType;
  message: string;
  logToConsole?: boolean;
  error?: Error | null;
}

const notify = ({ type, message, logToConsole = false, error = null }: NotifyParams) => {
    let log = logToConsole;
    const toastOptions = {
      position: "bottom-right" as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    };

    if (import.meta.env.DEV) {
      log = true;
    }

    if (log) {
      switch (type) {
        case 'success':
          console.log(`%c${message}`, 'color: green');
          break;
        case 'error':
          console.error(`%c${message}`, 'color: red', error);
          break;
        case 'info':
          console.log(`%c${message}`, 'color: blue');
          break;
        case 'warning':
          console.warn(`%c${message}`, 'color: orange');
          break;
        default:
          console.log(`%c${message}`, 'color: white');
      }
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      default:
        console.warn(`Unknown notification type: ${type}\nMessage: ${message}`);
    }
  }

export default notify;
