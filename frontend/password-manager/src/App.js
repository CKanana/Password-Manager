import React, { useState } from "react";
import LoginForm from "./components/Login";
import HomePage from "./components/Home";
import AddVault from "./components/vault";
import VaultList from "./components/vaultlist";
import VaultDetail from "./components/vaultdetail"; 

function App() {
  const [user, setUser] = useState(null);
  const [vaults, setVaults] = useState([]);
  const [page, setPage] = useState("home");
  const [selectedVault, setSelectedVault] = useState(null);

  const goToLogin = () => setPage("login");
  const goToVaultList = () => setPage("vaultlist");
  const goToAddVault = () => setPage("addVault");

  const addVault = (vault) => {
    setVaults([...vaults, { ...vault, id: Date.now(), passwords: [] }]);
    goToVaultList();
  };

  const openVault = (vault) => {
    setSelectedVault(vault);
    setPage("vaultDetail");
  };

  // Home Page
  if (page === "home") return <HomePage goToLogin={goToLogin} />;

  // Login Page
  if (page === "login")
    return <LoginForm setUser={(u) => { setUser(u); goToVaultList(); }} />;

  // Vault List Page
  if (page === "vaultlist") {
    return (
      <VaultList
        vaults={vaults}          // pass the current vaults
        openVault={openVault}    // pass function to open a vault
        goToAddVault={goToAddVault} 
      />
    );
  }

  // Add Vault Page
  if (page === "addVault") return <AddVault addVault={addVault} goBack={goToVaultList} />;

  // Vault Detail Page
  if (page === "vaultDetail" && selectedVault)
    return <VaultDetail vault={selectedVault} goBack={goToVaultList} />;

  return null;
}

export default App;
