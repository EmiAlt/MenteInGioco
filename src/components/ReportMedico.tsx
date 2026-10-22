import { useState, useEffect } from "react";

interface ReportMedicoProps {
  onChiudi: () => void;
}

interface GiornoReport {
  data: string;
  tempoMedioRisposta: number; // in secondi
  percentualeCorrette: number; // 0-100
  note: string;
}

const STORAGE_KEY = "report_medico_dati";

export default function ReportMedico({ onChiudi }: ReportMedicoProps) {
  const [dati, setDati] = useState<GiornoReport[]>([]);
  const [nomePaziente, setNomePaziente] = useState("Paziente");

  useEffect(() => {
    // Carica dati da localStorage o genera dati di esempio
    const datiSalvati = localStorage.getItem(STORAGE_KEY);
    
    if (datiSalvati) {
      try {
        setDati(JSON.parse(datiSalvati));
      } catch (e) {
        generaDatiEsempio();
      }
    } else {
      generaDatiEsempio();
    }

    // Carica nome paziente
    const profiloSalvato = localStorage.getItem("stimolazione_cognitiva_profilo_paziente");
    if (profiloSalvato) {
      try {
        const profilo = JSON.parse(profiloSalvato);
        setNomePaziente(profilo.nome || "Paziente");
      } catch (e) {
        // Usa default
      }
    }
  }, []);

  const generaDatiEsempio = () => {
    const giorni: GiornoReport[] = [];
    const notePossibili = [
      "Sessione regolare, buona partecipazione",
      "Leggera difficoltà nelle domande di logica",
      "Ottima performance, molto concentrato",
      "Sessione breve ma produttiva",
      "Buoni progressi nella memoria visiva",
      "Qualche esitazione, ma ha completato tutto",
      "Sessione eccellente, tempi di risposta rapidi",
    ];

    for (let i = 6; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      
      giorni.push({
        data: data.toLocaleDateString("it-IT", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
        tempoMedioRisposta: Math.round(8 + Math.random() * 12), // 8-20 secondi
        percentualeCorrette: Math.round(60 + Math.random() * 35), // 60-95%
        note: notePossibili[Math.floor(Math.random() * notePossibili.length)],
      });
    }

    setDati(giorni);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(giorni));
  };

  const handleStampa = () => {
    window.print();
  };

  const handleEsportaJSON = () => {
    const reportCompleto = {
      paziente: nomePaziente,
      dataGenerazione: new Date().toLocaleString("it-IT"),
      periodo: "Ultimi 7 giorni",
      dati: dati,
      statistiche: {
        tempoMedioComplessivo: Math.round(
          dati.reduce((sum, g) => sum + g.tempoMedioRisposta, 0) / dati.length
        ),
        percentualeMediaCorrette: Math.round(
          dati.reduce((sum, g) => sum + g.percentualeCorrette, 0) / dati.length
        ),
        giorniTotali: dati.length,
      },
    };

    const blob = new Blob([JSON.stringify(reportCompleto, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${nomePaziente}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calcola statistiche complessive
  const tempoMedioComplessivo = Math.round(
    dati.reduce((sum, g) => sum + g.tempoMedioRisposta, 0) / dati.length
  );
  const percentualeMediaCorrette = Math.round(
    dati.reduce((sum, g) => sum + g.percentualeCorrette, 0) / dati.length
  );

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-50 print:static print:inset-auto">
      {/* Header - nascosto in stampa */}
      <div className="bg-white border-b border-slate-200 p-4 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">📋 Report per il Medico</h2>
          <button
            onClick={onChiudi}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
          >
            ← Chiudi
          </button>
        </div>
      </div>

      {/* Contenuto */}
      <div className="flex-1 overflow-auto p-6 print:p-0">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg print:shadow-none print:rounded-none">
          {/* Intestazione Report */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 print:bg-blue-600">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Report di Attività Cognitiva</h1>
                <p className="text-blue-100 text-lg">Ultimi 7 giorni di monitoraggio</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Paziente</div>
                <div className="text-2xl font-bold">{nomePaziente}</div>
                <div className="text-sm text-blue-100 mt-2">
                  Generato il {new Date().toLocaleDateString("it-IT")}
                </div>
              </div>
            </div>
          </div>

          {/* Statistiche Summary */}
          <div className="grid grid-cols-3 gap-6 p-8 border-b border-slate-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{tempoMedioComplessivo}s</div>
              <div className="text-sm text-slate-600 mt-1">Tempo medio risposta</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600">{percentualeMediaCorrette}%</div>
              <div className="text-sm text-slate-600 mt-1">Risposte corrette medie</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{dati.length}</div>
              <div className="text-sm text-slate-600 mt-1">Giorni monitorati</div>
            </div>
          </div>

          {/* Tabella Dettagliata */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Dettaglio Giornaliero</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="text-left p-3 font-semibold text-slate-700">Data</th>
                  <th className="text-center p-3 font-semibold text-slate-700">Tempo Medio</th>
                  <th className="text-center p-3 font-semibold text-slate-700">% Corrette</th>
                  <th className="text-left p-3 font-semibold text-slate-700">Note</th>
                </tr>
              </thead>
              <tbody>
                {dati.map((giorno, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{giorno.data}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-mono">
                        {giorno.tempoMedioRisposta}s
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded font-mono font-bold ${
                          giorno.percentualeCorrette >= 80
                            ? "bg-emerald-50 text-emerald-700"
                            : giorno.percentualeCorrette >= 60
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {giorno.percentualeCorrette}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 text-sm">{giorno.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-8 bg-slate-50 text-sm text-slate-600">
            <p className="mb-2">
              <strong>Nota:</strong> Questo report è generato automaticamente dal sistema di stimolazione cognitiva e rappresenta un'attività di supporto, non una diagnosi medica.
            </p>
            <p>
              Per qualsiasi domanda o chiarimento, contattare il care giver del paziente.
            </p>
          </div>
        </div>
      </div>

      {/* Pulsanti azione - nascosti in stampa */}
      <div className="bg-white border-t border-slate-200 p-4 print:hidden">
        <div className="max-w-6xl mx-auto flex gap-3">
          <button
            onClick={handleStampa}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🖨️</span>
            <span>Stampa Report</span>
          </button>
          <button
            onClick={handleEsportaJSON}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>💾</span>
            <span>Esporta JSON</span>
          </button>
          <button
            onClick={onChiudi}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>

      {/* Stili per la stampa */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:static {
            position: static !important;
          }
          .print\\:inset-auto {
            inset: auto !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:bg-blue-600 {
            background: #2563eb !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
