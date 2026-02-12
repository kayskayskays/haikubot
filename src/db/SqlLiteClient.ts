import { KeyValueStore } from "./KeyValueStore.js";
import Database from "better-sqlite3";

import type { Database as DatabaseType } from "better-sqlite3";

export class SqlLiteClient implements KeyValueStore {

    private readonly _db: DatabaseType;

    private readonly _cache: Map<string, string> = new Map();

    constructor(private readonly _guildId: string) {
        this._db = new Database(KeyValueStore.STORE_NAME);

        this._db.prepare(`
            CREATE TABLE IF NOT EXISTS kv (
                outer_key TEXT NOT NULL,
                inner_key TEXT NOT NULL,
                value TEXT NOT NULL,
                PRIMARY KEY (outer_key, inner_key)
            )
        `).run();
    }

    get(key : string) : string | null {
        if ( this._cache.size === 0) {
            this.initializeCache();
        }

        return this._cache.get(key) ?? null;
    }
    set(key : string, value : string) : void {
        this._db.prepare(`
            INSERT INTO kv (outer_key, inner_key, value)
            VALUES (?, ?, ?)
            ON CONFLICT (outer_key, inner_key)
            DO UPDATE SET value = excluded.value
        `).run(this._guildId, key, value);

        this._cache.set(key, value);
    }

    unset(key : string) : void {
        this._db.prepare(`
            DELETE FROM kv
            WHERE outer_key = ? AND inner_key = ?
        `).run(this._guildId, key);

        this._cache.delete(key);
    }

    private initializeCache(): void {
        const rows = this._db.prepare(`
            SELECT inner_key, value FROM kv WHERE outer_key = ?
       `).all(this._guildId) as { inner_key: string, value: string }[];

        for ( const row of rows ) {
            this._cache.set(row.inner_key, row.value);
        }
    }

}