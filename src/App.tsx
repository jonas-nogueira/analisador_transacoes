
import { useEffect, useState } from 'react'


interface Transaction {
  raw: string;
  cedulas: Cedulas;
  cassetes: Cedulas;
  error: boolean;
}

interface Cedulas {
  c200: number;
  c100: number;
  c50: number;
  c20: number;
  c10: number;
  c5: number;
  c2: number;
  c1: number;
}

function compareCedulas(cedulas: Cedulas, other: Cedulas) {
  return cedulas.c200 == other.c200 &&
    cedulas.c100 == other.c100 &&
    cedulas.c50 == other.c50 &&
    cedulas.c20 == other.c20 &&
    cedulas.c10 == other.c10 &&
    cedulas.c5 == other.c5 &&
    cedulas.c2 == other.c2
}

function getCedulas(transaction: string) {
  const regexp = /^cedula:\s+(\d+)/gm;


  let cedulas: Cedulas = {
    c200: 0,
    c100: 0,
    c50: 0,
    c20: 0,
    c10: 0,
    c5: 0,
    c2: 0,
    c1: 0,
  };

  let match: RegExpExecArray | null;
  while ((match = regexp.exec(transaction)) != null) {
    const value = parseInt(match[1]);
    switch (value) {
      case 200:
        cedulas.c200 += 1;
        break;
      case 100:
        cedulas.c100 += 1;
        break;
      case 50:
        cedulas.c50 += 1;
        break;
      case 20:
        cedulas.c20 += 1;
        break;
      case 10:
        cedulas.c10 += 1;
        break;
      case 5:
        cedulas.c5 += 1;
        break;
      case 2:
        cedulas.c2 += 1;
        break;
      case 1:
        cedulas.c1 += 1;
        break;

    }
  }
  return cedulas;
}

function getCassetes(transaction: string) {
  const regexp = /^\s+([ABCDE]\s+)(\d+,\d{2})\s+(\d+)/gm;
  let cedulas: Cedulas = {
    c200: 0,
    c100: 0,
    c50: 0,
    c20: 0,
    c10: 0,
    c5: 0,
    c2: 0,
    c1: 0
  };

  let match: RegExpExecArray | null;
  while ((match = regexp.exec(transaction)) != null) {
    const cedulaValue = parseInt(match[2]);
    const cedulaCount = parseInt(match[3]);
    switch (cedulaValue) {
      case 200:
        cedulas.c200 += cedulaCount;
        break;
      case 100:
        cedulas.c100 += cedulaCount;
        break;
      case 50:
        cedulas.c50 += cedulaCount;
        break;
      case 20:
        cedulas.c20 += cedulaCount;
        break;
      case 10:
        cedulas.c10 += cedulaCount;
        break;
      case 5:
        cedulas.c5 += cedulaCount;
        break;
      case 2:
        cedulas.c2 += cedulaCount;
        break;
      case 1:
        cedulas.c1 += cedulaCount;
        break;

    }
  }
  return cedulas;
}

function App() {

  const [rawData, setRawData] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    console.log(transactions.filter(t => t.error == true));
  }, [transactions])


  return (
    <div className='flex p-8 w-full h-full'>
      <div className='flex flex-col w-1/2 p-4'>
        <textarea
          value={rawData}
          onChange={(event) => setRawData(event.target.value)}
          className='border-2 border-gray-400 rounded-sm grow font-mono'
        />
        <div className='flex p-2 justify-end'>
          <button
            className='p-2 bg-blue-800 text-white rounded-sm'
            onClick={() => {
              const limiter = "------------------------------------------------";
              const transactions: Transaction[] = rawData.split(limiter).map((raw) => {
                const cedulas = getCedulas(raw);
                const cassetes = getCassetes(raw);

                const error = !compareCedulas(cedulas, cassetes);

                return {
                  raw,
                  cedulas,
                  cassetes,
                  error
                }
              });
              setTransactions(transactions);
            }}
          >Processar</button>
        </div>
      </div>
      <div className='w-1/2'>
        <textarea 
          readOnly
          value={transactions.filter(t => t.error == true).map(t => t.raw).join("\n\n")} 
          className='w-full h-full font-mono'
        />
      </div>
    </div>
  )
}

export default App
