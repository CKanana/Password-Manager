import React from "react";

function VaultList({ vaults, openAddVault, openVault }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800 text-gray-200 p-6">
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/40 border border-purple-700/40 shadow-lg shadow-purple-800/20">
        <h1 className="text-3xl font-bold text-purple-300 text-center mb-6">
          Your Vaults
        </h1>

        {vaults.length === 0 ? (
          <p className="text-center text-gray-400 italic mb-6">No vaults added yet.</p>
        ) : (
          <ul className="space-y-3 mb-6">
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
        )}

        <div className="flex justify-center">
          <button
            onClick={openAddVault}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-purple-600/40 transition-all duration-300"
          >
            Add Vault
          </button>
        </div>
      </div>
    </div>
  );
}
export default VaultList;

