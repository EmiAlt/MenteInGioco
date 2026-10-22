import { useState } from "react";

interface EmojiPickerProps {
  valore: string;
  onChange: (emoji: string) => void;
  label?: string;
}

/**
 * Categorie di emoji organizzate per argomento
 * Ogni categoria contiene emoji rilevanti e familiari per utenti anziani
 */
const CATEGORIE_EMOJI: { nome: string; emoji: string; lista: string[] }[] = [
  {
    nome: "Cibo",
    emoji: "🍎",
    lista: [
      "🍎", "🍌", "🍇", "🍓", "🍊", "🍋", "🍉", "🍈", "🍒", "🍑",
      "🥭", "🍍", "🥝", "🍅", "🥕", "🌽", "🥔", "🍠", "🧅", "🧄",
      "🍞", "🥐", "🥖", "🧀", "🥚", "🍳", "🥓", "🥩", "🍗", "🍖",
      "🍝", "🍕", "🌮", "🌯", "🥗", "🍲", "🍜", "🍣", "🍱", "🍙",
      "🍰", "🎂", "🧁", "🍪", "🍩", "🍫", "🍬", "🍭", "☕", "🍵",
    ],
  },
  {
    nome: "Animali",
    emoji: "🐕",
    lista: [
      "🐕", "🐈", "🐎", "🐄", "🐖", "🐑", "🐐", "🐓", "🦆", "🦃",
      "🐇", "🐁", "🐀", "🐿️", "🦔", "🦊", "🐻", "🐼", "🐨", "🐯",
      "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐦", "🦅", "🦉", "🦆",
      "🐟", "🐠", "🐡", "🦈", "🐙", "🦋", "🐝", "🐞", "🐜", "🐢",
    ],
  },
  {
    nome: "Casa",
    emoji: "🏠",
    lista: [
      "🏠", "🏡", "🏢", "🏫", "🏥", "⛪", "🕌", "🏛️", "🏰", "🏭",
      "🛏️", "🛋️", "🪑", "🚪", "🪟", "🛁", "🚿", "🚽", "🪞", "🧸",
      "📺", "📻", "📞", "☎️", "🕰️", "⏰", "📷", "💡", "🔑", "🔒",
    ],
  },
  {
    nome: "Natura",
    emoji: "🌳",
    lista: [
      "🌳", "🌲", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂",
      "🌸", "🌹", "🌺", "🌻", "🌼", "💐", "🌷", "🌱", "🪴", "🎋",
      "🌊", "🏔️", "⛰️", "🌋", "🏖️", "🏝️", "🏜️", "☀️", "🌙", "⭐",
      "🌈", "☁️", "⛅", "❄️", "🌬️", "🌪️", "💧", "🔥", "💨", "🌍",
    ],
  },
  {
    nome: "Persone",
    emoji: "👨",
    lista: [
      "👶", "🧒", "👦", "👧", "👨", "👩", "👴", "👵", "👨‍👩‍👧", "👨‍👩‍👦",
      "👨‍🦳", "👩‍🦳", "👨‍🦰", "👩‍🦰", "🧑‍🦱", "👮", "👨‍⚕️", "👩‍⚕️", "👨‍🏫", "👩‍🏫",
      "👨‍🌾", "👩‍🌾", "👨‍🍳", "👩‍🍳", "👨‍🔧", "👷", "🤴", "👸", "🎅", "🤶",
    ],
  },
  {
    nome: "Vestiti",
    emoji: "👔",
    lista: [
      "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻",
      "👙", "👚", "👛", "👜", "👝", "🎒", "👞", "👟", "🥾", "🥿",
      "👠", "👡", "👢", "👑", "👒", "🎩", "🎓", "🧢", "⛑️", "💍",
    ],
  },
  {
    nome: "Trasporti",
    emoji: "🚗",
    lista: [
      "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
      "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🛺", "🚂",
      "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "✈️", "🛩️",
      "🚀", "🛸", "🚁", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "🚂",
    ],
  },
  {
    nome: "Sport",
    emoji: "⚽",
    lista: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
      "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🏹", "🎣",
      "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️",
      "🏂", "🪂", "🏋️", "🤸", "🧘", "🏊", "🚴", "🚵", "🤾", "🤼",
    ],
  },
  {
    nome: "Oggetti",
    emoji: "📦",
    lista: [
      "📦", "📱", "💻", "⌨️", "🖨️", "🖱️", "💿", "📀", "📷", "📹",
      "📺", "📻", "🎙️", "🎧", "📞", "☎️", "📟", "📠", "🔋", "🔌",
      "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶",
      "💷", "💰", "💳", "💎", "⚖️", "🔧", "🔨", "🔩", "⚙️", "🧰",
    ],
  },
  {
    nome: "Simboli",
    emoji: "❤️",
    lista: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
      "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐",
      "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐",
    ],
  },
];

export default function EmojiPicker({ valore, onChange, label }: EmojiPickerProps) {
  const [aperto, setAperto] = useState(false);
  const [categoriaAttiva, setCategoriaAttiva] = useState(CATEGORIE_EMOJI[0].nome);

  const categoriaCorrente = CATEGORIE_EMOJI.find((c) => c.nome === categoriaAttiva) || CATEGORIE_EMOJI[0];

  const selezionaEmoji = (emoji: string) => {
    onChange(emoji);
    setAperto(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Pulsante per aprire il picker */}
      <button
        type="button"
        onClick={() => setAperto(!aperto)}
        className="w-full flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors bg-white"
      >
        <span className="text-2xl">{valore || "📦"}</span>
        <span className="flex-1 text-left text-slate-700">
          {valore ? "Cambia emoji" : "Seleziona emoji..."}
        </span>
        <span className="text-slate-400">{aperto ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown con categorie e emoji */}
      {aperto && (
        <div className="absolute z-50 mt-1 w-full bg-white border-2 border-blue-300 rounded-lg shadow-xl">
          {/* Tabs categorie */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
            {CATEGORIE_EMOJI.map((cat) => (
              <button
                key={cat.nome}
                type="button"
                onClick={() => setCategoriaAttiva(cat.nome)}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  categoriaAttiva === cat.nome
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                title={cat.nome}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span className="hidden md:inline ml-1">{cat.nome}</span>
              </button>
            ))}
          </div>

          {/* Griglia emoji della categoria selezionata */}
          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-8 md:grid-cols-10 gap-1">
              {categoriaCorrente.lista.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selezionaEmoji(emoji)}
                  className={`aspect-square flex items-center justify-center text-2xl rounded hover:bg-blue-100 transition-colors ${
                    valore === emoji ? "bg-blue-200 ring-2 ring-blue-500" : ""
                  }`}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Pulsante chiudi */}
          <div className="border-t border-slate-200 p-2 flex justify-between items-center bg-slate-50">
            <span className="text-xs text-slate-500">
              Categoria: <strong>{categoriaCorrente.nome}</strong>
            </span>
            <button
              type="button"
              onClick={() => setAperto(false)}
              className="px-3 py-1 text-sm bg-slate-200 hover:bg-slate-300 rounded"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
