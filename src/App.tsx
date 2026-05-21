import React, { useEffect, useState } from "react";

interface Transaction {
    id: number;
    text: string;
    amount: number;
}

const App: React.FC = () => {
    const [transactions, setTransaction] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem("transactions");
        return saved ? JSON.parse(saved) : [];
    });

    const [text, setText] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !amount) return alert("Please add description and amount");

        const newTransaction: Transaction = {
            id: Date.now(),
            text,
            amount: +amount
        };

        setTransaction([...transactions, newTransaction]);
        setAmount("");
        setText("");
    };

    const removeTransaction = (id: number) => {
        setTransaction(transactions.filter(t => t.id !== id));
    };

    const clearAll = () => {
        if (confirm("clear all history?")) setTransaction([]);
    };

    const amounts = transactions.map(t => t.amount);

    const rawTotal = amounts.reduce((acc, item) => (acc += item), 0);


    const total = Math.abs(rawTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const income = amounts.filter(i => i > 0).reduce((acc, i) => (acc += i), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const expense = Math.abs(amounts.filter(i => i < 0).reduce((acc, i) => (acc += i), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="container">
            <h2 className="main-title">Budget Buddy</h2>

            <div className="main-layout">
                {/* LEFT COLUMN: FORM */}
                <div className="column-left glass">
                    <h3>New Entry</h3>
                    <form onSubmit={addTransaction}>
                        <div className="form-control">
                            <label>Description</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="What was it for?"
                            />
                        </div>
                        <div className="form-control">
                            <label>Amount (+ income, - expense)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <button className="btn">Add Transaction</button>
                    </form>
                </div>

                {/* MIDDLE COLUMN: BALANCE */}
                <div className="column-middle glass">
                    <div className="balance-container">
                        <small>TOTAL BALANCE</small>
                        {/* 3. Checks rawTotal to append + or - sign dynamically */}
                        <h1 id="balance">
                            {rawTotal > 0 ? '+' : rawTotal < 0 ? '-' : ''}${total}
                        </h1>
                    </div>
                    <div className="inc-exp-container">
                        <div className="inc-box">
                            <h4>Income</h4>
                            <p className="money plus">+${income}</p>
                        </div>
                        <div className="exp-box">
                            <h4>Expense</h4>
                            <p className="money minus">-${expense}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: HISTORY */}
                <div className="column-right glass">
                    <div className="history-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>History</h3>
                        <button id="clear-btn" onClick={clearAll}>Clear</button>
                    </div>
                    <ul className="list">
                        {transactions.map(t => (
                            <li key={t.id} className={t.amount < 0 ? 'minus' : 'plus'}>
                                <span className="tx-text">{t.text}</span>
                                <span className="tx-amount">
                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    <button onClick={() => removeTransaction(t.id)} className="delete-btn">x</button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default App;