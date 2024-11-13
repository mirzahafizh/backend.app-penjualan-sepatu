const { Transaksi,ProdukSepatu } = require('../models');
const mysql = require('mysql2/promise');
// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { userId, totalAmount, paymentMethod, paymentStatus, produkSepatuId, quantity, ukuran } = req.body;

        // Validasi input
        if (!userId || !totalAmount || !paymentMethod || !produkSepatuId || !quantity || !ukuran) {
            return res.status(400).json({ error: 'User ID, total amount, payment method, product ID, quantity, and ukuran are required.' });
        }

        // Buat koneksi ke database
        const connection = await mysql.createConnection({
            host: 'localhost',  // Ganti dengan host database Anda
            user: 'root',       // Ganti dengan username Anda
            password: 'root', // Ganti dengan password Anda
            database: 'db_penjualan_sepatu' // Ganti dengan nama database Anda
        });

        // Memulai transaksi
        await connection.beginTransaction();

        try {
            const transactionDate = new Date(); // Ambil tanggal dan waktu saat ini

            // Membuat transaksi baru
            const [newTransaction] = await connection.execute(
                'INSERT INTO transaksi (userId, totalAmount, paymentMethod, paymentStatus, produkSepatuId, ukuran, transactionDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, totalAmount, paymentMethod, paymentStatus || 'pending', produkSepatuId, ukuran, transactionDate] // Menambahkan transactionDate
            );

            // Mengambil produk dan stoknya
            const [productRows] = await connection.execute(
                'SELECT id, ukuran, stok FROM produk_sepatu WHERE id = ?',
                [produkSepatuId]
            );

            if (productRows.length === 0) {
                throw new Error('Product not found');
            }

            const product = productRows[0];
            const sizes = JSON.parse(product.ukuran);
            const stock = product.stok;

            console.log('Product:', product);
            console.log('Sizes:', sizes);
            console.log('Stock:', stock);

            // Mencari indeks ukuran yang dipilih
            const sizeIndex = sizes.indexOf(ukuran);
            console.log('Size Index:', sizeIndex);
            if (sizeIndex === -1) {
                throw new Error('Selected size not available');
            }

            // Memastikan stok cukup untuk ukuran yang dipilih
            console.log('Available stock for selected size:', stock[sizeIndex]);
            if (stock[sizeIndex] < quantity) {
                throw new Error('Not enough stock available');
            }

            // Mengurangi stok untuk ukuran yang dipilih
            stock[sizeIndex] -= quantity;

            console.log('Updated Stock:', stock);

            // Memperbarui stok produk dalam database
            await connection.execute(
                'UPDATE produk_sepatu SET stok = ? WHERE id = ?',
                [JSON.stringify(stock), produkSepatuId]
            );
            console.log('Stok setelah update:', stock);

            // Commit transaksi
            await connection.commit();
            res.status(201).json({ id: newTransaction.insertId, userId, totalAmount, paymentMethod, paymentStatus: paymentStatus || 'pending', produkSepatuId, ukuran });
        } catch (error) {
            await connection.rollback();
            console.error('Error during transaction:', error);
            res.status(500).json({ error: 'Failed to create transaction and update stock' });
        } finally {
            await connection.end(); // Tutup koneksi
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};

// Get all transactions for a user
const getUserTransactions = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user

        const transactions = await Transaksi.findAll({
            where: { userId },
            order: [['transactionDate', 'DESC']], // Order by transaction date
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentMethod, produkSepatuId, status_pengiriman } = req.body; // Include status_pengiriman

        const transaction = await Transaksi.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update only provided fields
        if (paymentStatus !== undefined) transaction.paymentStatus = paymentStatus;
        if (paymentMethod !== undefined) transaction.paymentMethod = paymentMethod;
        if (produkSepatuId !== undefined) transaction.produkSepatuId = produkSepatuId; // Update produkSepatuId if provided
        if (status_pengiriman !== undefined) transaction.status_pengiriman = status_pengiriman; // Update status_pengiriman if provided

        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
};


// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaksi.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await transaction.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};

// Get a transaction by user ID
const getTransactionByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the transactions for the specified user ID, including ProdukSepatu details
        const transactions = await Transaksi.findAll({
            where: { userId },
            include: [
                {
                    model: ProdukSepatu, // Join with ProdukSepatu model
                    as: 'produkSepatu', // Alias defined in the association
                }
            ],
        });

        if (transactions.length === 0) {
            return res.status(404).json({ error: 'No transactions found for this user' });
        }

        // Return the transaction data including the related ProdukSepatu data
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions by user ID:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

module.exports = {
    createTransaction,
    getUserTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionByUserId,
};
