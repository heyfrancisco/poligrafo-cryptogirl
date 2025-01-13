"use client";
import React, { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Trade {
  date: string;
  asset: string;
  pnl: number;
  pnl_5x: number;
  pnl_10x: number;
  pnl_20x: number;
}

interface TradesData {
  [key: string]: Trade[];
}

interface BankrollData {
  x: number;
  date: string;
  asset: string;
  bankroll_1x: number;
  bankroll_5x: number;
  bankroll_10x: number;
  bankroll_20x: number;
}

const LeverageComparison: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(100);
  const [betPercentage, setBetPercentage] = useState<number>(10);
  const [tradesData, setTradesData] = useState<TradesData>({});
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [data, setData] = useState<BankrollData[]>([]);
  const [final, setFinal] = useState<BankrollData | null>(null);

  const calculateBankrollGrowth = useCallback(
    (investment: number): BankrollData[] => {
      let bankroll_1x = investment;
      let bankroll_5x = investment;
      let bankroll_10x = investment;
      let bankroll_20x = investment;
      const betMultiplier = betPercentage / 100;
      const calculatedData: BankrollData[] = [];
      let tradeNumber = 0;

      const trades = tradesData[selectedMonth] || [];

      trades.forEach((trade) => {
        tradeNumber += 1;

        // 1x
        const betAmount_1x = bankroll_1x * betMultiplier;
        const pnl_1x = betAmount_1x * trade.pnl;
        bankroll_1x += pnl_1x;

        // 5x
        const betAmount_5x = bankroll_5x * betMultiplier;
        const pnl_5x = betAmount_5x * trade.pnl_5x;
        bankroll_5x += pnl_5x;

        // 10x
        const betAmount_10x = bankroll_10x * betMultiplier;
        const pnl_10x = betAmount_10x * trade.pnl_10x;
        bankroll_10x += pnl_10x;

        // 20x
        const betAmount_20x = bankroll_20x * betMultiplier;
        const pnl_20x = betAmount_20x * trade.pnl_20x;
        bankroll_20x += pnl_20x;

        calculatedData.push({
          x: tradeNumber,
          date: trade.date,
          asset: trade.asset,
          bankroll_1x: Math.round(bankroll_1x * 100) / 100,
          bankroll_5x: Math.round(bankroll_5x * 100) / 100,
          bankroll_10x: Math.round(bankroll_10x * 100) / 100,
          bankroll_20x: Math.round(bankroll_20x * 100) / 100,
        });
      });

      return calculatedData;
    },
    [betPercentage, selectedMonth]
  ); // Added dependencies for useCallback

  useEffect(() => {
    const newData = calculateBankrollGrowth(initialInvestment);
    setData(newData);
    setFinal(newData[newData.length - 1] || null);
  }, [initialInvestment, betPercentage, selectedMonth]);

  useEffect(() => {
    const fetchTradesData = async () => {
      const response = await fetch("/trades.json");
      const data: TradesData = await response.json();
      setTradesData(data);
      setSelectedMonth(Object.keys(data)[0]);
    };

    fetchTradesData();
  }, []);

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialInvestment(Math.max(1, Number(e.target.value)));
  };

  const handleBetPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetPercentage(Math.max(1, Math.min(100, Number(e.target.value))));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const formatTooltipLabel = (value: string): string => {
    // Access the actual data item that was passed to the tooltip
    const trade = data.find((item) => item.date === value);
    if (!trade) return "";
    return `Trade #${trade.x} - ${trade.date}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-5xl w-full">
        <CardHeader>
          <CardTitle className="text-xl pb-2">Poligrafo da Crypto Girl</CardTitle>
          <p className="text-sm text-muted-foreground pb-4">
            Simulação de ganhos mensais com base nos sinais partilhados pela{" "}
            <a
              href="https://www.instagram.com/cryptogirl.pt/"
              target="_blank"
              rel="noopener"
              className="text-indigo-500"
            >
              @Cryptogirl.pt
            </a>{" "}
            considerando sempre no 1º Alvo, mas utilizando stop loss total em casos de perda. Os resultados reais podem
            variar significativamente dependendo da estratégia de saída.
          </p>
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="month" className="text-sm font-bold">
                Mês:
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-2 py-1 border rounded"
              >
                {Object.keys(tradesData).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="investment" className="text-sm font-bold">
                Investimento Inicial: $
              </label>
              <input
                id="investment"
                type="number"
                value={initialInvestment}
                onChange={handleInvestmentChange}
                className="w-24 px-2 py-1 border rounded text-right"
                min="1"
                step="100"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="betPercentage" className="text-sm font-bold">
                % da Banca Por Trade:
              </label>
              <input
                id="betPercentage"
                type="number"
                value={betPercentage}
                onChange={handleBetPercentageChange}
                className="w-20 px-2 py-1 border rounded text-right"
                min="1"
                max="100"
                step="1"
              />
              <span className="text-sm">%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded">
                <div className="text-sm font-medium">1x (Sem Alavancagem)</div>
                <div className="text-2xl font-bold">${final?.bankroll_1x.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  Retorno: {(((final?.bankroll_1x ?? 0) / initialInvestment - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm font-medium">5x Alavancagem</div>
                <div className="text-2xl font-bold">${final?.bankroll_5x.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  Retorno: {(((final?.bankroll_5x ?? 0) / initialInvestment - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm font-medium">10x Alavancagem</div>
                <div className="text-2xl font-bold">${final?.bankroll_10x.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  Retorno: {(((final?.bankroll_10x ?? 0) / initialInvestment - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm font-medium">20x Alavancagem</div>
                <div className="text-2xl font-bold">${final?.bankroll_20x.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  Retorno: {(((final?.bankroll_20x ?? 0) / initialInvestment - 1) * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" label={{ value: "Days of the Month", position: "bottom", offset: -1 }} />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    domain={["dataMin - 1", "dataMax + 10"]}
                    interval={0}
                    allowDataOverflow={true}
                  />
                  <Tooltip formatter={(value) => `$${value}`} labelFormatter={formatTooltipLabel} />
                  <Legend wrapperStyle={{ paddingTop: "30px" }} />
                  <Line
                    type="monotone"
                    dataKey="bankroll_1x"
                    name="1x (Sem Alavancagem)"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="bankroll_5x" name="5x Alavancagem" stroke="#82ca9d" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="bankroll_10x"
                    name="10x Alavancagem"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="bankroll_20x"
                    name="20x Alavancagem"
                    stroke="#FF0000"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-4 px-4 pb-1">
            Código fonte disponível no{" "}
            <a
              href="https://github.com/heyfrancisco/calculadora-crypto"
              className="text-indigo-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ❤ GitHub
            </a>
            . Histórico de trades podem ser encontrado em{" "}
            <a
              href="/trades.json"
              className="text-indigo-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /trades.json.{" "}
            </a>
          </p>
          <p className="text-xs text-muted-foreground px-4 pb-1">
            Trading com alavancagem envolve alto risco de perda rápida de capital.
          </p>
          <p className="text-xs text-muted-foreground px-4">
            Os resultados apresentados são simulações baseadas em dados históricos e não garantem retornos futuros.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeverageComparison;
