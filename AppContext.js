import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [addDataFirst, setAddDataFirst] = useState(false);

  return (
    <AppContext.Provider value={{ addDataFirst, setAddDataFirst }}>
      {children}
    </AppContext.Provider>
  );
};
