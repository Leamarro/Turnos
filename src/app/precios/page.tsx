"use client";

import { useState } from "react";

type PriceField = "perfilado" | "maquillaje";

export default function PreciosPage() {
  const [prices, setPrices] = useState({
    perfilado: 2500,
    maquillaje: 5000,
  });

  const updatePrice = (field: PriceField, value: string) => {
    setPrices({ ...prices, [field]: Number(value) });
  };

  return (
    <div className="max-w-xl mx-auto mt-28 px-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Precios</h1>

      <div className="flex flex-col gap-6">

        <div className="p-4 border rounded-xl shadow-sm">
          <label className="font-semibold">Precio Perfilado</label>
          <input
            type="number"
            value={prices.perfilado}
            onChange={(e) => updatePrice("perfilado", e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />
        </div>

        <div className="p-4 border rounded-xl shadow-sm">
          <label className="font-semibold">Precio Maquillaje</label>
          <input
            type="number"
            value={prices.maquillaje}
            onChange={(e) => updatePrice("maquillaje", e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />
        </div>

        <button className="mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-900">
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
