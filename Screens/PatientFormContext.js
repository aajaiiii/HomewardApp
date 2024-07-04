import React, { createContext, useState } from 'react';

const PatientFormContext = createContext();

export const PatientFormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  return (
    <PatientFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </PatientFormContext.Provider>
  );
};

export default PatientFormContext;
