import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DownloadButton = ({ onDownloadClick }) => {
  const { t } = useTranslation();
  return (
    <Button variant="primary" onClick={onDownloadClick}>
   {t('downloadBook')}
    </Button>
  );
};

export default DownloadButton;