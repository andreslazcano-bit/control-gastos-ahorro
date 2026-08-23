"use client";

import { useRef, useState } from "react";
import { useAppData } from "@/context/DataContext";
import { exportDataToFile, parseImportedFile } from "@/lib/storage";
import ConfirmDialog from "./ConfirmDialog";

export default function ExportImportBar({ compact = false }: { compact?: boolean }) {
  const { data, replaceData } = useAppData();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleExport() {
    exportDataToFile(data);
    setMessage("Respaldo descargado.");
    setTimeout(() => setMessage(null), 2500);
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = "";
  }

  async function confirmImport() {
    if (!pendingFile) return;
    try {
      const text = await pendingFile.text();
      const imported = parseImportedFile(text);
      replaceData(imported);
      setMessage("Datos importados correctamente.");
      setTimeout(() => setMessage(null), 2500);
    } catch {
      setErrorMsg("No se pudo leer el archivo. Asegúrate de que sea un .json exportado desde esta app.");
    } finally {
      setPendingFile(null);
    }
  }

  const btnClass = compact
    ? "flex items-center justify-center gap-1.5 rounded-lg border border-border-strong h-9 w-9 sm:w-auto sm:px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover hover:text-text-primary"
    : "flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover hover:text-text-primary";
  const labelClass = compact ? "hidden sm:inline" : undefined;

  return (
    <div className={compact ? "flex items-center gap-2" : "flex flex-col gap-3"}>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={handleExport} title="Exportar datos" className={btnClass}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span className={labelClass}>Exportar datos</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Importar datos"
          className={btnClass}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span className={labelClass}>Importar datos</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>
      {message && <p className="text-sm text-good-text">{message}</p>}

      <ConfirmDialog
        open={pendingFile !== null}
        title="Importar datos"
        description="Esto reemplazará todos los datos actuales (ingresos, gastos, categorías y metas) con el contenido del archivo. ¿Quieres continuar?"
        confirmLabel="Importar y reemplazar"
        danger
        onConfirm={confirmImport}
        onCancel={() => setPendingFile(null)}
      />
      <ConfirmDialog
        open={errorMsg !== null}
        title="Error al importar"
        description={errorMsg ?? undefined}
        confirmLabel="Entendido"
        onConfirm={() => setErrorMsg(null)}
        onCancel={() => setErrorMsg(null)}
      />
    </div>
  );
}
