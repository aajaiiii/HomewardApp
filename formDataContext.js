import React, { createContext, useState } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [patientFormData, setPatientFormData] = useState({});
  
  return (
    <FormDataContext.Provider value={{ patientFormData, setPatientFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
