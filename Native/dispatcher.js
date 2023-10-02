import {SourceManager} from './sourceManager';
import {storageLog} from '../utils/storageUtils';
import {ENDPOINTS_CONFIG, ENTITIES_CONFIG, STORAGE_CONFIG} from '../const/config';
import WebsocketManager_old from './websocketManager';
import {SOURCE_CONFIG} from '../axios';

export class Dispatcher {
    constructor() {
        console.log("Frontend Storage 2.26.7")
        this._subscribers = {}
        this._sourceManager = new SourceManager()
    }

    async getData(entityCode, coid = 0, force = false) {
        const entityConfig = this._getEntityConfig(entityCode)
        coid = parseInt(coid, 10)
        coid = isNaN(coid) ? 0 : coid;
        force = entityConfig && entityConfig.alwaysForce !== undefined ? true : force
        const isSingle = entityConfig && entityConfig.isSingle !== undefined
        return entityConfig
            ? await this._sourceManager.getEntityData(entityCode, entityConfig.storeName, entityConfig.endpoints, coid, force, isSingle)
            : new Promise((resolve, reject) => {
                reject('Сущность не найдена')
            });
    }

    async saveData(data, entityCode, coid = 0) {
        const entityConfig = this._getEntityConfig(entityCode)
        return entityConfig
            ? await this._sourceManager.saveData(data, entityCode, entityConfig.storeName, coid)
            : new Promise((resolve, reject) => {
                reject('Сущность не найдена')
            });
    }

    async cleanData(coid, subscriber) {
        if (this._subscribers[subscriber] !== undefined) {
            await this._sourceManager.cleanData(coid, this._subscribers[subscriber])
        }
        return true
    }

    async getAllData(coid, subscriber) {
        if (this._subscribers[subscriber] !== undefined) {
            await this._sourceManager.getAllData(coid, this._subscribers[subscriber])
        }
    }

    async _wsConnect() {
        await this._sourceManager.wsConnect()
    }

    async _loadSubscribeData(subscriber, coid) {
        if (this._subscribers[subscriber] !== undefined) {
            for (const entityCode of this._subscribers[subscriber]) {
                if (ENTITIES_CONFIG[entityCode] !== undefined) {
                    if (STORAGE_CONFIG[ENTITIES_CONFIG[entityCode].storeName].level === 'object') {
                        coid && await this.getData(entityCode, coid)
                    } else {
                        await this.getData(entityCode)
                    }
                }
            }
        }
    }

    async subscribe(entityCodes, subscriber = 'default', coid = 0) {
        // this._sourceManager.setStorageDataChanged(10359256)
        if (localStorage.getItem('overload')) {
            console.warn("Очистка данных по причине overload'а...")
            await this._sourceManager.cleanAllData()
            console.info("Очистка данных завершена")
            // await this._sourceManager._updateRoom(10359256);
            localStorage.removeItem('overload')
        } else {
            const room_list = localStorage.getItem('storage_data_changed')
            if (room_list) {
                console.warn("Очистка агрегатов данных по причине изменений...")
                await this._sourceManager.deleteAggregates(room_list.split(','))
                console.info("Очистка агрегатов завершена")
                localStorage.removeItem('storage_data_changed')
            }
        }

        if (entityCodes) {
            if (!Array.isArray(entityCodes)) {
                entityCodes = [entityCodes]
            }
            if (this._subscribers[subscriber] === undefined) {
                this._subscribers[subscriber] = []
            }
            this._subscribers[subscriber] = [...new Set([...this._subscribers[subscriber], ...entityCodes])]
        }
        coid && await this._loadSubscribeData(subscriber, coid)

        await this._wsConnect()

        let result = {}
        result[subscriber] = this._subscribers[subscriber]
        return result
    }

    _getEntityConfig(entityCode = null) {
        return entityCode
            ? (ENTITIES_CONFIG[entityCode] === undefined ? false : ENTITIES_CONFIG[entityCode])
            : ENTITIES_CONFIG;
    }
}