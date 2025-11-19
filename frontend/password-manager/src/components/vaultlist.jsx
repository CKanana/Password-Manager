function VaultList({ vaults, openVault, goToAddVault }) {
  if (!vaults) vaults = [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800 text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-purple-300 mb-6">Your Vaults</h1>

      {vaults.length === 0 ? (
        <>
          <p className="text-gray-400 italic mb-6">No vaults yet. Click "Add Vault" to create one.</p>
          <button
            onClick={goToAddVault}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Add Vault
          </button>
        </>
      ) : (
        <>
          <ul className="space-y-3 mb-6 w-full max-w-md">
            {vaults.map((vault) => (
              <li
                key={vault.id}
                onClick={() => openVault(vault)}
                className="p-3 bg-purple-800/40 hover:bg-purple-700/60 rounded-lg text-purple-100 font-medium text-center cursor-pointer transition-all duration-200"
              >
                {vault.vaultName}
              </li>
            ))}
          </ul>
          <button
            onClick={goToAddVault}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Add Vault
          </button>
        </>
      )}
    </div>
  );
}

export default VaultList;
