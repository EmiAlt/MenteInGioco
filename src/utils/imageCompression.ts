/**
 * Utility per la compressione e gestione delle immagini
 */

/**
 * Comprime un'immagine riducendo dimensioni e qualità
 * @param base64Image - Immagine in formato base64
 * @param maxWidth - Larghezza massima (default: 800px)
 * @param maxHeight - Altezza massima (default: 800px)
 * @param quality - Qualità JPEG (0-1, default: 0.7)
 * @returns Promise con l'immagine compressa in base64
 */
export function comprimiImmagine(
  base64Image: string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Calcola le nuove dimensioni mantenendo l'aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Crea un canvas per ridimensionare l'immagine
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Impossibile creare il context del canvas'));
        return;
      }

      // Disegna l'immagine ridimensionata
      ctx.drawImage(img, 0, 0, width, height);

      // Converti in JPEG compresso
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      
      console.log(`[COMPRESSIONE] Immagine compressa: ${img.width}x${img.height} → ${width}x${height}`);
      console.log(`[COMPRESSIONE] Dimensione: ${(base64Image.length / 1024).toFixed(2)} KB → ${(compressedBase64.length / 1024).toFixed(2)} KB`);
      
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Errore nel caricamento dell\'immagine'));
    };

    img.src = base64Image;
  });
}

/**
 * Calcola la dimensione approssimativa del localStorage utilizzato
 * @returns Dimensione in KB
 */
export function calcolaDimensioneLocalStorage(): number {
  let totalSize = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  
  return totalSize / 1024; // Converti in KB
}

/**
 * Verifica se c'è spazio sufficiente nel localStorage
 * @param dataSizeKB - Dimensione dei dati da salvare in KB
 * @returns true se c'è spazio sufficiente
 */
export function verificaSpazioLocalStorage(dataSizeKB: number): boolean {
  const currentSize = calcolaDimensioneLocalStorage();
  const maxSize = 5000; // 5 MB in KB (limite conservativo)
  
  return (currentSize + dataSizeKB) < maxSize;
}

/**
 * Formatta la dimensione in KB/MB per la visualizzazione
 * @param sizeKB - Dimensione in KB
 * @returns Stringa formattata
 */
export function formattaDimensione(sizeKB: number): string {
  if (sizeKB < 1024) {
    return `${sizeKB.toFixed(2)} KB`;
  } else {
    return `${(sizeKB / 1024).toFixed(2)} MB`;
  }
}
