/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AboutGuideModal, AboutGuideModalProps } from './AboutGuideModal';

export type VersionNotesModalProps = AboutGuideModalProps;

export const VersionNotesModal: React.FC<VersionNotesModalProps> = (props) => {
  return <AboutGuideModal {...props} />;
};

export { AboutGuideModal };
