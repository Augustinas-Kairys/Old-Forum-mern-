import React, { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import notificationSound from '../components/assets/notification.mp3';
import './assets/styles.scss';

interface NotificationProps {
  message: string;
  type: 'success' | 'danger' | 'info';
  id: number; // Add id prop for unique identification
}

const Notification: FC<NotificationProps> = ({ message, type, id }) => {
  useEffect(() => {
    const audio = new Audio(notificationSound);
    audio.play();

    // Remove notification after 3 seconds
    const timeout = setTimeout(() => {
      // Remove the notification by updating the state
      setNotification(null);
    }, 3000);

    // Return a cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const iconMap = {
    success: faCheckCircle,
    danger: faExclamationCircle,
    info: faInfoCircle,
  };

  return (
    <div
      className={`notification position-fixed top-0 end-0 p-3 m-3 bg-${type} text-white rounded shadow animate__animated animate__slideInLeft`}
      style={{ zIndex: 9999, maxWidth: '300px', marginTop: `${id * 70}px` }}
    >
      <div className="d-flex align-items-center">
        <div className="notification-icon me-2">
          <FontAwesomeIcon icon={iconMap[type]} />
        </div>
        <div className="notification-content">
          <p className="mb-0">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
