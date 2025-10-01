import React, { createContext, ReactNode } from 'react';
import { MatomoTrackerInstance } from './types';

export interface MatomoContextType {
  instance?: MatomoTrackerInstance;
}

export const MatomoContext = createContext<MatomoContextType>({});

export interface MatomoProviderProps {
  instance: MatomoTrackerInstance;
  children: ReactNode;
}

const MatomoProvider: React.FC<MatomoProviderProps> = ({ instance, children }: MatomoProviderProps) => (
  <MatomoContext.Provider value={{ instance }}>{children}</MatomoContext.Provider>
);

export default MatomoProvider;