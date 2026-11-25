(() => {
    "use strict";

    const DB_NAME = "portfolioProCertificates";
    const DB_VERSION = 1;
    const STORE_NAME = "certificates";

    function getUserId() {
        const session = JSON.parse(
            sessionStorage.getItem("portfolioSession") || "null"
        );

        const users = JSON.parse(
            localStorage.getItem("portfolioUsers") || "[]"
        );

        if (!session ||
            session.role !== "user" ||
            !Array.isArray(users) ||
            !users.some(user => user.id === session.id)
        ) {
            throw new Error("Please log in to your user account.");
        }

        return session.id;
    }

    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                const db = request.result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: "id"
                    });

                    store.createIndex("userId", "userId");
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function runTransaction(mode, action) {
        const db = await openDatabase();

        try {
            return await new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, mode);
                const store = transaction.objectStore(STORE_NAME);
                let result;

                transaction.oncomplete = () => resolve(result);

                transaction.onabort = () => {
                    reject(
                        transaction.error ||
                        new Error("Storage operation failed.")
                    );
                };

                try {
                    action(store, value => {
                        result = value;
                    });
                } catch (error) {
                    transaction.abort();
                    reject(error);
                }
            });
        } finally {
            db.close();
        }
    }

    async function add({ title, issuer = "", date = "", file }) {
        const userId = getUserId();

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        if (typeof title !== "string" || !title.trim()) {
            throw new Error("Enter a certificate title.");
        }

        if (!(file instanceof File) ||
            !allowedTypes.includes(file.type) ||
            file.size === 0 ||
            file.size > 5 * 1024 * 1024
        ) {
            throw new Error("Choose a PDF, JPG or PNG file up to 5 MB.");
        }

        const certificate = {
            id: crypto.randomUUID(),
            userId,
            title: title.trim(),
            issuer: issuer.trim(),
            date,
            file,
            createdAt: Date.now()
        };

        await runTransaction("readwrite", store => {
            store.add(certificate);
        });

        return certificate;
    }

    async function list() {
        const userId = getUserId();

        return runTransaction("readonly", (store, done) => {
            const request = store.index("userId").getAll(userId);

            request.onsuccess = () => {
                done(
                    request.result.sort((a, b) => b.createdAt - a.createdAt)
                );
            };
        });
    }

    async function remove(id) {
        const userId = getUserId();

        return runTransaction("readwrite", (store, done) => {
            const request = store.get(id);

            request.onsuccess = () => {
                if (!request.result || request.result.userId !== userId) {
                    done(false);
                    return;
                }

                store.delete(id);
                done(true);
            };
        });
    }

    window.PortfolioCertificates = Object.freeze({
        add,
        list,
        remove
    });
})();